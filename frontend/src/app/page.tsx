import styled from 'styled-components'

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
`

const Title = styled.h1`
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 2rem;
`

export default function Home() {
  return (
    <Container>
      <Title>Sistema de Regulação</Title>
      <p>Bem-vindo ao sistema de regulação!</p>
    </Container>
  )
} 