import { Request, Response, NextFunction } from 'express';
import { supabase } from '../services/supabase';
import { config } from '../config';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

// Função auxiliar para logging
const logDebug = (message: string, data?: any) => {
  if (config.server.nodeEnv === 'development') {
    console.log(`[AUTH] ${message}`, data ? data : '');
  }
};

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  logDebug('Iniciando verificação de autenticação');
  
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    logDebug('Header de autorização não encontrado');
    return res.status(401).json({
      error: 'Token não fornecido',
      code: 'AUTH_NO_TOKEN'
    });
  }

  const token = authHeader.split(' ')[1];
  
  if (!token) {
    logDebug('Token não encontrado no header');
    return res.status(401).json({
      error: 'Token mal formatado',
      code: 'AUTH_INVALID_TOKEN_FORMAT'
    });
  }

  try {
    logDebug('Verificando token com Supabase');
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error) {
      logDebug('Erro ao verificar token:', error);
      return res.status(401).json({
        error: 'Token inválido',
        code: 'AUTH_INVALID_TOKEN',
        details: config.server.nodeEnv === 'development' ? error : undefined
      });
    }

    if (!user) {
      logDebug('Usuário não encontrado');
      return res.status(401).json({
        error: 'Usuário não encontrado',
        code: 'AUTH_USER_NOT_FOUND'
      });
    }

    logDebug('Usuário autenticado:', { id: user.id, email: user.email });
    req.user = {
      id: user.id,
      email: user.email!,
      role: user.role || 'user'
    };
    next();
  } catch (error) {
    logDebug('Erro inesperado na autenticação:', error);
    return res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'AUTH_INTERNAL_ERROR',
      details: config.server.nodeEnv === 'development' ? error : undefined
    });
  }
};

// Middleware para verificar se o usuário tem uma role específica
export const requireRole = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Não autenticado',
        code: 'AUTH_NOT_AUTHENTICATED'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Não autorizado',
        code: 'AUTH_NOT_AUTHORIZED'
      });
    }

    next();
  };
}; 