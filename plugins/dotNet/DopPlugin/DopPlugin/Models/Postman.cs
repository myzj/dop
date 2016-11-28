using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Web.UI;
using ServiceStack.DataAnnotations;
using ServiceStack.ServiceHost;

namespace DopPlugin.Models
{
    //Postman

    [DataContract]
    public class Postman
    {
        #region 内部类
        [DataContract]
        public class ItemModel
        {
            [DataMember(Name = "base")]
            public BaseModel Base { get; set; }

            [DataMember(Name = "request")]
            public RequestModel Request { get; set; }

            [DataMember(Name = "response")]
            public ResponseModel Response { get; set; }

            [DataMember(Name = "error_code")]
            public List<ErrorCodeModel> ErrorCode { get; set; }

        }

        [DataContract]
        public class InfoModel
        {
            [DataMember(Name = "project")]
            public string Project { get; set; }

        }

        [DataContract]
        public class BaseModel
        {
            [DataMember(Name = "name")]
            public string Name { get; set; }

            [DataMember(Name = "mock")]
            public string Mock { get; set; }

            [DataMember(Name = "tags")]
            public List<string> Tags { get; set; }

            [DataMember(Name = "description")]
            public string Description { get; set; }

            [DataMember(Name = "state")]
            public bool State { get; set; }

        }

        [DataContract]
        public class RequestModel
        {
            [DataMember(Name = "url")]
            public string Url { get; set; }

            [DataMember(Name = "method")]
            public string Method { get; set; }

            [DataMember(Name = "content_type")]
            public string ContentType { get; set; }

            [DataMember(Name = "headers")]
            public List<FieldModel> Headers { get; set; }

            [DataMember(Name = "query_string")]
            public List<FieldModel> QueryString { get; set; }

            [DataMember(Name = "body")]
            public List<FieldModel> Body { get; set; }
        }

        [DataContract]
        public class ResponseModel
        {
            /// <summary>
            /// urlencoded , raw
            /// </summary>
            [DataMember(Name = "mode")]
            public string Mode { get; set; }

            [DataMember(Name = "body")]
            public List<FieldModel> Body { get; set; }
        }

        [DataContract]
        public class FieldModel
        {
            [DataMember(Name = "field_name")]
            public string FieldName { get; set; }

            [DataMember(Name = "field_type")]
            public string Type { get; set; }

            [DataMember(Name = "is_array")]
            public bool IsArray { get; set; }

            [DataMember(Name = "is_required")]
            public bool IsRequired { get; set; }

            [DataMember(Name = "default")]
            public string Default { get; set; }

            [DataMember(Name = "example")]
            public string Example { get; set; }

            [DataMember(Name = "description")]
            public string Description { get; set; }

            [DataMember(Name = "child_item")]
            public List<FieldModel> ChildItem { get; set; }

        }

        [DataContract]
        public class ErrorCodeModel
        {
            [DataMember(Name = "error_code")]
            public string ErrorCode { get; set; }

            [DataMember(Name = "display_message")]
            public string DisplayMessage { get; set; }

            [DataMember(Name = "description")]
            public string Description { get; set; }
        }
        #endregion

        [DataMember(Name = "info")]
        public InfoModel Info { get; set; }

        [DataMember(Name = "item")]
        public List<ItemModel> Item { get; set; }

    }


}
