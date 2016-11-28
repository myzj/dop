using System;
using System.Web;
using DopPlugin.DocHandler;

namespace DopPlugin
{
    public class GanerateDocHandler : IHttpHandler
    {

        public bool IsReusable
        {
            get { return true; }
        }

        public void ProcessRequest(HttpContext context)
        {
            var queryAction = context.Request["actionName"] ?? "";
            //var format = (context.Request["format"] ?? "json").ToUpper();
            //var docType = (context.Request["type"] ?? "swagger").ToUpper();

            var filterNames = queryAction.Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries);

            var postman = new PostmanHandler(filterNames);
            
            HttpContext.Current.Response.Write(postman.GetJson());
            HttpContext.Current.Response.ContentType = "application/json";
            HttpContext.Current.Response.End();
        }

    }
}
