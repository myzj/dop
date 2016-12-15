using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;
using DopPlugin.DocHandler;
using DopPlugin.DopPlugins;

namespace DopPlugin
{
    public class Router
    {
        private HttpRequest Request
        {
            get { return HttpContext.Current.Request; }
        }

        private HttpResponse Response
        {
            get { return HttpContext.Current.Response; }
        }

        private Dictionary<string, AbsDopPlugin> routerConfig = new Dictionary<string, AbsDopPlugin>();

        public Router()
        {
            routerConfig.Add("/docs", new DocsPlugin());
        }

        public void ExecAction()
        {
            var path = Request.Url.AbsolutePath.Replace("/dop", "");

            foreach (var dopPlugin in routerConfig)
            {
                var regex = new Regex(dopPlugin.Key);
                if (regex.IsMatch(path))
                {
                    dopPlugin.Value.ExecAction();
                    break;
                }
            }
        }
    }
}
