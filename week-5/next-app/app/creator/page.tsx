import { Card } from "@/components/HtmlElements";
import CreateLottery from "./CreateLottery";


const Home = () => {

    return (
    <div className="grid grid-cols-12 grid-rows-{10} items-center w-full">
        <h1 className="col-span-12 row-span-1 text-center text-5xl">Lottery Creator</h1>
        <Card className=' col-start-2 row-span-9 col-span-10'>
            <CreateLottery />
        </Card>
    </div>
    )
}

export default Home;