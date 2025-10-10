import AuthForm from '../../components/AuthForm'

export default function LoginPage() {
  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1 className="auth-title">Connexion</h1>
        <p className="auth-subtitle">Accédez à votre dashboard</p>
        <AuthForm mode="login" />
      </div>
    </div>
  )
}
