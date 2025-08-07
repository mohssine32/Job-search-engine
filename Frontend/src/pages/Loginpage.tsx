import { Link } from 'react-router-dom'
import jobsearchloginpic from '../assets/jobsearchloginpic.png'




function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Partie gauche */}
      <div className="bg-[#F8D3E8] w-full lg:w-1/2 p-10 flex flex-col justify-center items-center text-center">
      
      <img src={jobsearchloginpic}  alt="" className='w-[400px]' />
       
        <h2 className="text-xl font-bold mt-4">Boostez votre recherche d'emploi</h2>
        <p className="text-sm mt-2 max-w-sm">
          Organisez vos candidatures, recevez des suggestions personnalisées, activez des alertes et découvrez nos conseils sur le monde du travail.
        </p>
      </div>

      {/* Partie droite */}
      <div className="w-full lg:w-1/2 flex justify-center items-center p-8">
        <form className="w-full max-w-md">
          <h2 className="text-2xl font-bold mb-2">Accédez à votre espace personnel</h2>
          <p className="mb-6">
            Connectez-vous ou <Link to="/register" className="text-yellow-500 font-semibold">inscrivez-vous gratuitement</Link>.
          </p>

          <div className="mb-4">
            <label className="block mb-1 font-medium">Adresse email <span className="text-red-500">*</span></label>
            <input type="email" className="w-full border border-gray-300 px-4 py-2 rounded" required />
          </div>

          <div className="mb-2">
            <label className="block mb-1 font-medium">Mot de passe <span className="text-red-500">*</span></label>
            <input type="password" className="w-full border border-gray-300 px-4 py-2 rounded" required />
            <div className="text-right mt-1">
              <Link to="/forgot-password" className="text-sm text-yellow-500">Mot de passe oublié ?</Link>
            </div>
          </div>

          <div className="mb-4 mt-2">
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox mr-2" />
              Me garder connecté
            </label>
          </div>

          <button type="submit" className="bg-yellow-400 hover:bg-yellow-500 text-black w-full py-2 font-semibold rounded">
            Se connecter
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
