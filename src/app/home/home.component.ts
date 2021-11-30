import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Arweave from 'arweave';
import { createContract, readContract, interactWrite, interactRead } from 'smartweave';
import { card_contract_source, 
         card_contract_initial_state } from './contract_text';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    private flipped_: boolean = false;
    private purchased_: boolean = false;

    private arweave_: any;
    private key_community_: any;
    private wallet_community_: any;
    private key_creator_: any;
    private wallet_creator_: any;
    private key_purchaser_: any;
    private wallet_purchaser_: any;
    private card_initial_state_tx_id_: string = "";
    private current_state_: string = "";
    private owner_hash_: string = "VScLuKWg5VPKnn9NQYWmpzPJU7IV3qETds-xTRcxpim";
    private tx_hash_: string = "zPJU7IV3qETds-xTRcxpimVScLuKWg4FGYnn9NQYWmp";
    private edition_: string = "";
    private current_pst_balance_: number = 0;


    public get Flipped() { return this.flipped_; }
    public get Purchased() { return this.purchased_; }
    public get CurrentState() { return this.current_state_; }
    public get OwnerHash() { return this.owner_hash_; }
    public get TxHash() { return this.tx_hash_; }
    public get Edition() { return this.edition_; }
    public get CurrentPstBalance() { return this.current_pst_balance_; }

    constructor(private http_: HttpClient) { 
    }

    ngOnInit(): void {
    }

    async setup() {

        this.info();
        await this.createWallets();
        await this.createCardContract();
        await this.readLatestState();
    }

    async mine() {
        const data = await this.http_.get("http://localhost:1984/mine").toPromise();
    }

    flip() {
        this.flipped_ = !this.flipped_;
    }

    async buy() {
        this.purchased_ = true;

        const input = {
            function: 'tip'
        };
        const txid = await interactWrite(this.arweave_, this.key_community_, this.card_initial_state_tx_id_, input);
        console.log(txid);
        this.tx_hash_ = txid;
        this.edition_ = txid;
        await this.mine();
        await this.readLatestState();
    }

    async curate() {
        const input = {
            function: 'curate'
        };
        const txid = await interactWrite(this.arweave_, this.key_community_, this.card_initial_state_tx_id_, input);
        console.log(txid);
        this.tx_hash_ = txid;
        await this.mine();
        await this.readLatestState();
    }


    info() {
        this.arweave_ = Arweave.init({
          host: 'localhost',
          port: 1984,
          protocol: 'http'
        });

        console.log(this.arweave_);
    }

    async createWallets() {

        this.key_community_ = await this.arweave_.wallets.generate();
        this.wallet_community_ = await this.arweave_.wallets.jwkToAddress(this.key_community_);

        this.key_creator_ = await this.arweave_.wallets.generate();
        this.wallet_creator_ = await this.arweave_.wallets.jwkToAddress(this.key_creator_);

        this.key_purchaser_ = await this.arweave_.wallets.generate();
        this.wallet_purchaser_ = await this.arweave_.wallets.jwkToAddress(this.key_purchaser_);

        console.log("Wallet Community");
        console.log(this.wallet_community_);

    }

    async createCardContract() {
        this.card_initial_state_tx_id_ = await createContract(this.arweave_, this.key_community_, card_contract_source, card_contract_initial_state);
    }

    async tipCard() {

    }

    async readLatestState() {
        const latestState = await readContract(this.arweave_, this.card_initial_state_tx_id_);
        console.log(latestState);
        this.owner_hash_ = latestState.owner;
        this.current_state_ = JSON.stringify(latestState, undefined, 2);
        this.current_pst_balance_ = latestState.balances[this.wallet_community_];
    }
}
