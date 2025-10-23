import picalanding from '../assets/picalanding.png'
//import picblanding from '../assets/picblanding.png'

function Findjobsection() {
    return (
    <>
<div className="w-full ">
    <h1 className="text-black font-bold  text-center text-[32px]">Trouvez un job</h1>
    <p className="text-gray-500 text-center text-[22px]">Vous avez le pouvoir d'écrire votre histoire. Find your people !</p>
</div>

<div className='flex flex-col justify-around h-[500px] mx-[10px]'>
    <div>
      <img src={picalanding} alt="Landing" className='w-[290px]'/>
    </div>

    <div>
        <h1 className='text-black font-bold text-[25px]'>Entrez dans les coulisses</h1>
        <p className='mt-[10px] text-gray-700 '>Arrêtez de scroller sans fin sur des offres impersonnelles. Consultez seulement celles qui répondent à vos besoins grâce à nos filtres. Entrez dans les coulisses des entreprises, découvrez leurs valeurs et rencontrez votre future équipe.</p>
        <button className='bg-black text-white p-[15px] rounded-md mt-[10px]'>Trouver un job</button>
    </div>
</div>

       </>
    )
}

export default Findjobsection