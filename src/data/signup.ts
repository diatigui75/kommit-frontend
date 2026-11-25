export const signupContent = {
  title: 'Créer un compte',
  firstName: { label: 'Prénom*', error: 'Renseigne ton prénom.' },
  email: { label: 'Email*', placeholder: 'jean.dev@gmail.com', error: 'Renseigne un email valide.' },
  password: { label: 'Mot de passe*', error: 'Ton mot de passe doit contenir au moins 8 caractères.' },
  submit: 'Créer un compte',
  submitPending: 'Création du compte en cours',
  footerText: 'Tu as déjà un compte ? ',
  footerLink: 'Connecte-toi.',
} as const
