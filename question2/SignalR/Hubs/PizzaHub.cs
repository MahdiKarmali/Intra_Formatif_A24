using Microsoft.AspNetCore.SignalR;
using SignalR.Services;

namespace SignalR.Hubs
{
    public class PizzaHub : Hub
    {
        private readonly PizzaManager _pizzaManager;

        public PizzaHub(PizzaManager pizzaManager) {
            _pizzaManager = pizzaManager;
        }

        public override async Task OnConnectedAsync()
        {
            _pizzaManager.AddUser(); 
            await Clients.All.SendAsync("UpdateNbUsers", _pizzaManager.NbConnectedUsers);
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            _pizzaManager.RemoveUser(); 
            await Clients.All.SendAsync("UpdateNbUsers", _pizzaManager.NbConnectedUsers);
            await base.OnDisconnectedAsync(exception);
        }

        public async Task SelectChoice(PizzaChoice choice)
        {
            var group = _pizzaManager.GetGroupName(choice);
            await Groups.AddToGroupAsync(Context.ConnectionId, group);

            var idx = (int)choice;
            var price = _pizzaManager.PIZZA_PRICES[idx];
            var money = _pizzaManager.Money[idx];
            var nb = _pizzaManager.NbPizzas[idx];

            await Clients.Caller.SendAsync("UpdatePizzaPrice", price);
            await Clients.Caller.SendAsync("UpdateNbPizzasAndMoney", nb, money);
        }

        public async Task UnselectChoice(PizzaChoice choice)
        {
            var group = _pizzaManager.GetGroupName(choice);
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, group);
        }

        public async Task AddMoney(PizzaChoice choice)
        {
            _pizzaManager.IncreaseMoney(choice);

            var idx = (int)choice;
            var money = _pizzaManager.Money[idx];
            var group = _pizzaManager.GetGroupName(choice);

            await Clients.Group(group).SendAsync("UpdateMoney", money);
        }

        public async Task BuyPizza(PizzaChoice choice)
        {
            _pizzaManager.BuyPizza(choice);

            var idx = (int)choice;
            var money = _pizzaManager.Money[idx];
            var nb = _pizzaManager.NbPizzas[idx];
            var group = _pizzaManager.GetGroupName(choice);

            await Clients.Group(group).SendAsync("UpdateNbPizzasAndMoney", nb, money);
        }
    }
}
