import { Card } from '@/components/HtmlElements'
import LotteryStatus from './LotteryStatus'
import WithdrawPrize from './WithdrawPrize'
export default function Home() {

    return (
        <div className='flex flex-col items-center w-full'>
            <h1 className='text-4xl p-5'>Lottery Manager</h1>
            <div>
                <Card>
                    <LotteryStatus />
                </Card>
                <Card>
                    <WithdrawPrize />
                </Card>
            </div>
        </div>
    )
}