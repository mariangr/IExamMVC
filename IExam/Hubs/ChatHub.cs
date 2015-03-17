using System;
using System.Web;
using Microsoft.AspNet.SignalR;

namespace IExam.Controllers
{
    public class ChatHub : Hub
    {
        public void Send(string name, string message)
        {
            Clients.All.addNewMessageToPage(Helpers.UserManagerStatic.GetFullName(name) , message);
        }
    }
}