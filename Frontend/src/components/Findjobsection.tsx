import picalanding from '../assets/picalanding.png'
import picblanding from '../assets/picblanding.png'

function Findjobsection() {
    return (

    <>
<div className="w-full ">
    <h1 className="text-black font-bold  text-center text-[32px] mt-[30px]">Trouvez un job</h1>
    <p className="text-gray-500 text-center text-[22px]">Vous avez le pouvoir d'écrire votre histoire. Find your people !</p>
</div>

<div className='flex flex-col justify-around h-[600px] mx-[10px]  items-center md:flex-row md:h-[400px] md:justify-center md:gap-8' >
    <div className='w-[290px]  sm:h-[200px] md:w-[350px]'>
      <img src={picalanding}  alt="Landing" className='w-[290px] mx-auto sm:mx-0'/>
    </div>

    <div className=' w-[300px] md:w-[400px] lg:w-[500px]'>
        <h1 className='text-black font-bold text-[25px] '>Entrez dans les coulisses</h1>
        <p className='mt-[10px] text-gray-700 '>Arrêtez de scroller sans fin sur des offres impersonnelles. Consultez seulement celles qui répondent à vos besoins grâce à nos filtres. Entrez dans les coulisses des entreprises, découvrez leurs valeurs et rencontrez votre future équipe.</p>
        <button className='bg-black text-white p-[15px] rounded-md mt-[10px]'>Trouver un job</button>
    </div>
</div>

<div className='flex flex-col justify-around h-[600px] mx-[10px]  items-center md:flex-row md:h-[400px] md:justify-center md:gap-8' >
    <div className=' w-[300px] md:w-[400px] lg:w-[500px]'>
        <h1 className='text-black font-bold text-[25px] '>Entrez dans les coulisses</h1>
        <p className='mt-[10px] text-gray-700 '>Arrêtez de scroller sans fin sur des offres impersonnelles. Consultez seulement celles qui répondent à vos besoins grâce à nos filtres. Entrez dans les coulisses des entreprises, découvrez leurs valeurs et rencontrez votre future équipe.</p>
        <button className='bg-black text-white p-[15px] rounded-md mt-[10px]'>Trouver un job</button>
    </div>
     <div className='w-[290px]  sm:h-[200px] md:w-[350px]'>
      <img src={picblanding}  alt="Landing" className='w-[290px] mx-auto sm:mx-0'/>
    </div>
</div>
<div className='flex flex-col justify-around h-[600px] mx-[10px]  items-center md:flex-row md:h-[400px] md:justify-center md:gap-8' >
    <div className='w-[290px]  sm:h-[200px] md:w-[350px]'>
      <img src={picalanding}  alt="Landing" className='w-[290px] mx-auto sm:mx-0'/>
    </div>

    <div className=' w-[300px] md:w-[400px] lg:w-[500px]'>
        <h1 className='text-black font-bold text-[25px] '>Entrez dans les coulisses</h1>
        <p className='mt-[10px] text-gray-700 '>Arrêtez de scroller sans fin sur des offres impersonnelles. Consultez seulement celles qui répondent à vos besoins grâce à nos filtres. Entrez dans les coulisses des entreprises, découvrez leurs valeurs et rencontrez votre future équipe.</p>
        <button className='bg-black text-white p-[15px] rounded-md mt-[10px]'>Trouver un job</button>
    </div>
</div>

       </>
    )
}

export default Findjobsection
/**sm:flex-row sm:h-[290px] sm:items-center */