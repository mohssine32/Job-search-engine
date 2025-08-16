import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import jobsearchloginpic from '../assets/jobsearchloginpic.png';

export function LoginPage() {
  // --- ON ÉCRIT LA LOGIQUE POUR LA CONNEXION ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    
    try {
      const response = await axios.post(
        'http://localhost:3000/auth/login', // <-- APPEL À LA CONNEXION
        { email, password } // On n'envoie PAS de rôle
      );
      
      const token = response.data.access_token;
      alert('Connexion réussie !');
      localStorage.setItem('user_token', token); // On stocke le token
      window.location.href = '/'; // On redirige vers l'accueil
      
    } catch (err) {
      setError('Email ou mot de passe incorrect.');
    }
  };

  return (
    // --- VOTRE JSX DE CONNEXION EST DÉJÀ PARFAIT ---
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* ... (Partie gauche avec l'image) ... */}
      <div className="bg-[#F8D3E8] w-full lg:w-1/2 p-10 flex flex-col justify-center items-center text-center">
        <img src={jobsearchloginpic}  alt="" className='w-[400px]' />
        <h2 className="text-xl font-bold mt-4">Boostez votre recherche d'emploi</h2>
        <p className="text-sm mt-2 max-w-sm">
          Organisez vos candidatures, recevez des suggestions personnalisées, activez des alertes et découvrez nos conseils sur le monde du travail.
        </p>
      </div>
      
      {/* Partie droite avec le formulaire de connexion */}
      <div className="w-full lg:w-1/2 flex justify-center items-center p-8">
        <form onSubmit={handleSubmit} className="w-full max-w-md"> {/* On lie le bon handleSubmit */}
          <h2 className="text-2xl font-bold mb-2">Accédez à votre espace personnel</h2>
          <p className="mb-6">Connectez-vous ou <Link to="/register" className="text-yellow-500 font-semibold">inscrivez-vous gratuitement</Link>.</p>

          <div className="mb-4">
            <label className="block mb-1 font-medium">Adresse email <span className="text-red-500">*</span></label>
            {/* On lie les champs aux états React */}
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full border border-gray-300 px-4 py-2 rounded" required />
          </div>

          <div className="mb-2">
            <label className="block mb-1 font-medium">Mot de passe <span className="text-red-500">*</span></label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full border border-gray-300 px-4 py-2 rounded" required />
            <div className="text-right mt-1">
              <Link to="/forgot-password" className="text-sm text-yellow-500">Mot de passe oublié ?</Link>
            </div>
          </div>
          
          {error && <p className="text-red-500 text-center my-2">{error}</p>}

          <button type="submit" className="bg-yellow-400 hover:bg-yellow-500 text-black w-full py-2 font-semibold rounded mt-4">
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
}