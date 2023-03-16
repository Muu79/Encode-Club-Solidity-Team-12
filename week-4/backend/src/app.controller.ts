import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { Hash } from "crypto";
import { AppService } from "./app.service";
import { CastVoteDTO } from "./dtos/castVote.dto";
import { DelegateDTO } from "./dtos/delegate.dto";
import { MintDTO } from "./dtos/mint.dto";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // Ballot functions

  @Get("voting-power")
  async votingPower(@Query("ballotAddress") ballotAddress: string, @Query("address") address: string): Promise<object> {
    return await this.appService.votingPower(ballotAddress, address);
  }

  @Get("get-proposals")
  async getProposals(@Query("ballotAddress") ballotAddress: string): Promise<object> {
    return await this.appService.getProposals(ballotAddress);
  }

  @Get("winning-proposal")
  async winningProposal(@Query("ballotAddress") ballotAddress: string): Promise<object> {
    return await this.appService.winningProposal(ballotAddress);
  }

  @Get("recent-votes")
  recentVotes(): object[] {
    return this.appService.getRecentVotes();
  }

  @Post("cast-vote")
  /*castVote with private key from .env
  async castVote(@Body() body: CastVoteDTO): Promise<string> {
    return await this.appService.castVote(body.ballotAddress, body.proposal, body.amount);
  }*/
  castVote(@Body() body: CastVoteDTO): object {
    return this.appService.castVote(body.ballotAddress, body.proposal, body.amount);
  }

  // Token functions

  @Post("mint")
  mint(@Body() body: MintDTO): object {
    return this.appService.mint(body.to, body.amount.toString());
  }

  @Post("delegate")
  delegate(@Body() body: DelegateDTO): object {
    return this.appService.delegate(body.to);
  }
}
