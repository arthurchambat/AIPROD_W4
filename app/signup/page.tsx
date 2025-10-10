import AuthForm from '../../components/AuthForm'

export default function SignupPage() {
  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1 className="auth-title">Créer un compte</h1>
        <p className="auth-subtitle">Commencez à générer des images avec l'IA</p>
        <AuthForm mode="signup" />
      </div>
    </div>
  )
}
