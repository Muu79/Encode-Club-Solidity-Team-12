import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { MintDTO } from './dtos/mint.dto';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  
  // Ballot functions

  @Get('voting-power')
  async votingPower(
    @Query('ballotAddress') ballotAddress: string,
    @Query('address') address: string,
  ): Promise<object> {
    return await this.appService.votingPower(ballotAddress, address);
  }

  // Token functions

  @Post('mint')
  mint(@Body() body: 
  MintDTO) {
    return this.appService.mint(body.to, body.amount.toString());
  }
}
