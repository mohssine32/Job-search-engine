import picalanding from '../assets/picalanding.png'
import picblanding from '../assets/picblanding.png'

function Findjobsection() {
    return (
        <div className='w-[1280px]  mx-auto '>
            <div>
                <h1 className='font-bold text-4xl text-center mt-[60px]'>Trouvez un job</h1>
                <h2 className='text-gray-600 text-2xl text-center'>Vous avez le pouvoir d'écrire votre histoire. The job is yours !</h2>
            </div>

            <div className='mt-[80px]  flex justify-around items-center  h-[450px]'>
                <div className=' w-[450px]'><img src={picalanding} alt="" className='w-[400px]' /></div>
                <div className=' w-[600px]'>

                    <h1 className='font-bold text-4xl '>Entrez dans les coulisses</h1>
                    <p className='text-gray-700 pt-[10px]'>Arrêtez de scroller sans fin sur des offres impersonnelles. Consultez seulement celles qui répondent à vos besoins grâce à nos filtres. Entrez dans les coulisses des entreprises,
                        découvrez leurs valeurs et rencontrez votre future équipe.</p>
                    <button className='bg-black text-white w-[140px] h-[45px] mt-3.5 rounded-lg font-bold cursor-pointer'>trouver un job</button>
                </div>

            </div>
            <div className='mt-[80px]  flex justify-around items-center h-[400px]'>
                <div className=' w-[600px]'>

                    <h1 className='font-bold text-4xl '>Laissez les jobs venir à vous</h1>
                    <p className='text-gray-700 pt-[10px]'>Ne soyez plus seulement la personne qui cherche. Soyez aussi celle que l’on trouve. Créez gratuitement votre profil, indiquez votre disponibilité et les entreprises qui recrutent
                        vous contacteront directement pour vous proposer des opportunités.</p>
                    <button className='bg-black text-white w-[250px] h-[45px] mt-3.5 rounded-lg font-bold cursor-pointer'>recevoir des opportunités</button>
                </div>
                <div className=' w-[450px]'><img src={picblanding} alt="" className='w-[450px]' /></div>
            </div>

            <div className='mt-[80px]  flex justify-around items-center h-[400px]'>
                  <div className=' w-[450px]'><img src={picblanding} alt="" className='w-[450px]' /></div>
                <div className=' w-[600px]'>

                    <h1 className='font-bold text-4xl '>Gagnez en efficacité</h1>
                    <p className='text-gray-700 pt-[10px]'>Laisser votre job préféré vous passer sous le nez ? Plus jamais ! Dans votre espace personnel, gérez votre recherche, centralisez toutes vos candidatures et comparez les jobs. Grâce à nos alertes personnalisées,
                         soyez le premier ou la première à postuler.</p>
                    <button className='bg-black text-white w-[250px] h-[45px] mt-3.5 rounded-lg font-bold cursor-pointer'>Suivre mes condidatures</button>
                </div>
              
            </div>


        </div>
    )
}

export default Findjobsection