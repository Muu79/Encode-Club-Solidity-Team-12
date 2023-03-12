import { Card, PrimaryBtn, InputField } from "@/components/HtmlElements";

export default function Home() {
  return (
    <div className="flex flex-col items-center mt-20">
      <h1 className="text-5xl font-bold">Week 4 Project</h1>
      <p className="text-xl mt-5">
        Please connect your wallet by clicking the connect button
      </p>
      <PrimaryBtn name="Connect Wallet" />

      <div className="flex">
        <Card>
          <h1 className="text-xl text-left mb-3">Request Tokens</h1>
          <InputField inputType="number" placeholder="Amount of tokens" />
          <PrimaryBtn name="Request Tokens" />
        </Card>

        <Card>
          <h1 className="text-xl text-left mb-3">Cast Vote</h1>
          <InputField inputType="number" placeholder="Index of proposal" />
          <PrimaryBtn name="Cast Vote" />
        </Card>

        <Card>
          <h1 className="text-xl text-left mb-3">Delegate Vote</h1>
          <InputField inputType="text" placeholder="Address of delegate" />
          <PrimaryBtn name="Delegate Vote" />
        </Card>
      </div>

      <div className="flex mt-12">
        <div className="mx-5">
          <PrimaryBtn name="Query Result" />
        </div>
        <div className="mx-5">
          <PrimaryBtn name="Voting History" />
        </div>
      </div>
    </div>
  );
}
