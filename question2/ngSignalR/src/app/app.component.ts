import { Component } from '@angular/core';
import * as signalR from "@microsoft/signalr"
import { MatButtonModule } from '@angular/material/button';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: true,
    imports: [MatButtonModule]
})
export class AppComponent {
  title = 'Pizza Hub';

  private hubConnection?: signalR.HubConnection;
  isConnected: boolean = false;

  selectedChoice: number = -1;
  nbUsers: number = 0;

  pizzaPrice: number = 0;
  money: number = 0;
  nbPizzas: number = 0;

  constructor(){
    this.connect();
  }

  async connect() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5282/hubs/pizza')
      .build();

    // TODO: Mettre isConnected à true seulement une fois que la connection au Hub est faite
    this.hubConnection.on('UpdateNbUsers', (count: number) => {
      this.nbUsers = count;
    });

    this.hubConnection.on('UpdateMoney', (money: number) => {
      this.money = money;
    });

    this.hubConnection.on('UpdateNbPizzasAndMoney', (nbPizzas: number, money: number) => {
      this.nbPizzas = nbPizzas;
      this.money = money;
    });

    this.hubConnection.on('UpdatePizzaPrice', (price: number) => {
      this.pizzaPrice = price;
    });

    await this.hubConnection.start();
    this.isConnected = true;
  }

  async selectChoice(selectedChoice:number) {
    this.selectedChoice = selectedChoice;
    await this.hubConnection?.invoke('SelectChoice', selectedChoice);
  }

  async unselectChoice() {
     if (this.selectedChoice < 0) return;
    const prev = this.selectedChoice;
    this.selectedChoice = -1;
    await this.hubConnection?.invoke('UnselectChoice', prev);
  }

  async addMoney() {
    if (this.selectedChoice < 0) return;
    await this.hubConnection?.invoke('AddMoney', this.selectedChoice);
  }

  async buyPizza() {
    if (this.selectedChoice < 0) return;
    await this.hubConnection?.invoke('BuyPizza', this.selectedChoice);
  }
}
