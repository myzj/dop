using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Web.UI;
using ServiceStack.DataAnnotations;
using ServiceStack.ServiceHost;
using ServiceStack.ServiceInterface.ServiceModel;

namespace DopPlugin.Models
{
    //Postman

    [DataContract]
    public class AtmModel
    {
        #region 内部类
        [DataContract]
        public class ItemModel
        {
            public ItemModel()
            {
                Base = new BaseModel();
                Request = new RequestModel();
                Response = new ResponseModel();
                ErrorCode = new List<ErrorCodeModel>();
            }

            [DataMember(Name = "base")]
            public BaseModel Base { get; set; }

            [DataMember(Name = "request")]
            public RequestModel Request { get; set; }

            [DataMember(Name = "response")]
            public ResponseModel Response { get; set; }

            [DataMember(Name = "error_code")]
            public List<ErrorCodeModel> ErrorCode { get; set; }

            //是否有效的
            public bool IsValid()
            {
                var result = true;
                if (Base != null && Request != null && Response != null)
                {
                    if (string.IsNullOrWhiteSpace(Base.Description)
                        || (Base.Description ?? "").IndexOf("###", StringComparison.Ordinal) >= 0
                        || CheckFieldDescriptionExisEmpty(Request.Body.Data)
                        || CheckFieldDescriptionExisEmpty(Response.Body)
                        )
                    {
                        result = false;
                    }
                }
                return result;
            }

            /// <summary>
            /// 检查字段备注是否存在为空的，需要递归查询
            /// </summary>
            /// <param name="fieldModels"></param>
            /// <returns></returns>
            private bool CheckFieldDescriptionExisEmpty(List<FieldModel> fieldModels)
            {
                var result = false;

                foreach (var fieldModel in fieldModels)
                {
                    if (string.IsNullOrWhiteSpace(fieldModel.Description))
                    {
                        result = true;
                        break;
                    }
                    else
                    {
                        if (fieldModel.ChildItem.Any())
                        {
                            result = CheckFieldDescriptionExisEmpty(fieldModel.ChildItem);
                        }
                    }
                }

                return result;
            }

        }

        [DataContract]
        public class InfoModel
        {
            public InfoModel()
            {
                Project = "";
            }

            [DataMember(Name = "project")]
            public string Project { get; set; }

        }

        [DataContract]
        public class BaseModel
        {
            public BaseModel()
            {
                Name = "";
                Mock = "";
                Tags = new List<string>();
                Description = "";
                State = false;
            }

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
            public RequestModel()
            {
                Url = "";
                Method = "";
                Headers = new List<FieldModel>();
                ContentType = "";
                QueryString = new List<FieldModel>();
                Body = new RequestBodyModel();
            }

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
            public RequestBodyModel Body { get; set; }
        }

        [DataContract]
        public class RequestBodyModel
        {
            public RequestBodyModel()
            {
                Mode = "";
                Data = new List<FieldModel>();
            }

            /// <summary>
            /// urlencoded , raw
            /// </summary>
            [DataMember(Name = "mode")]
            public string Mode { get; set; }

            [DataMember(Name = "data")]
            public List<FieldModel> Data { get; set; }
        }

        [DataContract]
        public class ResponseModel
        {
            [DataMember(Name = "body")]
            public List<FieldModel> Body { get; set; }
        }

        [DataContract]
        public class FieldModel
        {
            public FieldModel()
            {
                FieldName = "";
                FieldType = "";
                Default = "";
                Example = "";
                Description = "";
                ChildItem = new List<FieldModel>();
            }

            [DataMember(Name = "field_name")]
            public string FieldName { get; set; }

            [DataMember(Name = "field_type")]
            public string FieldType { get; set; }

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
            public ErrorCodeModel()
            {
                ErrorCode = "";
                DisplayMessage = "";
                Description = "";
            }

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
