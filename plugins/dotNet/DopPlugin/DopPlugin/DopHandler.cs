using System;
using System.Web;
using DopPlugin.DocHandler;

namespace DopPlugin
{
    public class DopHandler : IHttpHandler
    {

        public bool IsReusable
        {
            get { return true; }
        }

        public void ProcessRequest(HttpContext context)
        {
            var router = new Router();
            router.ExecAction();
        }

    }
}
