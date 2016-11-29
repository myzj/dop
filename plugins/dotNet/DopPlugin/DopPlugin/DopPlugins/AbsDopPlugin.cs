using System.Web;
using ServiceStack.FluentValidation.Validators;

namespace DopPlugin.DopPlugins
{
    public abstract class AbsDopPlugin
    {
        public HttpRequest Request
        {
            get { return HttpContext.Current.Request; }
        }

        public HttpResponse Response
        {
            get { return HttpContext.Current.Response; }
        }

        public virtual void ExecAction()
        {

        }
    }
}
