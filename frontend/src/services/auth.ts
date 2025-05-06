export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  error?: string;
}

class AuthService {
  private static instance: AuthService;
  private readonly masterEmail: string;
  private readonly masterPassword: string;
  private token: string | null = null;

  private constructor() {
    this.masterEmail = process.env.NEXT_PUBLIC_MASTER_EMAIL || 'admin@example.com';
    this.masterPassword = process.env.NEXT_PUBLIC_MASTER_PASSWORD || 'admin123';
    
    // Log das credenciais carregadas (apenas em desenvolvimento)
    if (process.env.NODE_ENV === 'development') {
      console.log('Credenciais mestres carregadas:', {
        email: this.masterEmail,
        password: this.masterPassword ? '******' : undefined,
      });
    }
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public async login(email: string, password: string): Promise<AuthResponse> {
    try {
      // Simula uma chamada à API
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Log das credenciais recebidas (apenas em desenvolvimento)
      if (process.env.NODE_ENV === 'development') {
        console.log('Tentativa de login:', {
          email,
          password: '******',
          masterEmail: this.masterEmail,
          masterPassword: this.masterPassword ? '******' : undefined,
        });
      }

      if (email === this.masterEmail && password === this.masterPassword) {
        const token = this.generateToken();
        this.token = token;
        localStorage.setItem('auth_token', token);

        return {
          success: true,
          token,
          user: {
            id: '1',
            name: 'Administrador',
            email: this.masterEmail,
          },
        };
      }

      return {
        success: false,
        error: 'Email ou senha inválidos',
      };
    } catch (error) {
      console.error('Erro de login:', error);
      return {
        success: false,
        error: 'Erro ao fazer login',
      };
    }
  }

  public logout(): void {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  public isAuthenticated(): boolean {
    return !!this.token || !!localStorage.getItem('auth_token');
  }

  public getToken(): string | null {
    return this.token || localStorage.getItem('auth_token');
  }

  private generateToken(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }
}

export const authService = AuthService.getInstance(); 