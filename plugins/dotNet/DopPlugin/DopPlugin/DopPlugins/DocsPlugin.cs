using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using DopPlugin.DocHandler;
using DopPlugin.DopPlugins;
using DopPlugin.Models;

namespace DopPlugin.DopPlugins
{
    public class DocsPlugin : AbsDopPlugin
    {
        /// <summary>
        /// 
        /// </summary>
        public override void ExecAction()
        {
            var apis = Request.QueryString["apis"] ?? "";
            //var format = (context.Request["format"] ?? "json").ToUpper();
            //var docType = (context.Request["type"] ?? "swagger").ToUpper();
            var act = (Request.QueryString["act"] ?? "").ToUpper();

            var filterNames = apis.Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries);

            var postman = new AtmHandler(filterNames);

            switch (act)
            {
                case "CHECK":
                    {
                        var newItem = new List<AtmModel.ItemModel>();
                        foreach (var itemModel in postman.ModelData.Item)
                        {
                            if (!itemModel.IsValid())
                            {
                                newItem.Add(itemModel);
                            }
                        }
                        postman.ModelData.Item = newItem;
                    }
                    break;
            }

            HttpContext.Current.Response.Write(postman.GetJson());
            HttpContext.Current.Response.ContentType = "application/json";
            HttpContext.Current.Response.End();
        }
    }
}
