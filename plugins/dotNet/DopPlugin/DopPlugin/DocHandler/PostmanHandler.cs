using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using DopPlugin.Models;
using Newtonsoft.Json;
using ServiceStack.ServiceHost;
using ServiceStack.ServiceInterface.ServiceModel;
using ServiceStack.WebHost.Endpoints;

namespace DopPlugin.DocHandler
{
    public class PostmanHandler
    {
        public Models.Postman ModelData;
        public string[] FilterNames { get; set; }

        public PostmanHandler(string[] filterNames)
        {
            #region Init json datatype list
            //jsonDataTypeDict.Add(typeof(bool).FullName, "boolean");
            //jsonDataTypeDict.Add(typeof(DateTime).FullName, "string");
            //jsonDataTypeDict.Add(typeof(Int16).FullName, "int");
            //jsonDataTypeDict.Add(typeof(Int32).FullName, "int");
            //jsonDataTypeDict.Add(typeof(Int64).FullName, "int");
            //jsonDataTypeDict.Add(typeof(float).FullName, "int");
            //jsonDataTypeDict.Add(typeof(double).FullName, "int");
            //jsonDataTypeDict.Add(typeof(decimal).FullName, "int");
            #endregion

            FilterNames = filterNames;

            var req = HttpContext.Current.Request;

            ModelData = new Postman();
            ModelData.Info = new Models.Postman.InfoModel() { Project = req.Url.Port.ToString() };

            var serviceMap = EndpointHost.Config.ServiceManager.Metadata.OperationNamesMap;
            ModelData.Item = new List<Models.Postman.ItemModel>();
            foreach (var service in serviceMap)
            {
                #region Filter Api
                if (FilterNames.Any())
                {
                    var valided = false;
                    foreach (var filterName in FilterNames)
                    {
                        if (service.Key.IndexOf(filterName, StringComparison.CurrentCultureIgnoreCase) >= 0)
                        {
                            valided = true;
                            break;
                        }
                    }
                    if (!valided)
                    {
                        continue;
                    }
                }
                #endregion

                var item = new Models.Postman.ItemModel();

                #region Base
                item.Base = new Models.Postman.BaseModel() { Name = service.Value.Name, Description = service.Value.Name, State = true, Tags = new ArrayOfString() };

                item.Base.Tags.AddRange(service.Value.Routes.Select(c => c.Path).ToList());
                #endregion

                #region Request
                var request = new Models.Postman.RequestModel()
                {
                    Url = "/json/reply/" + service.Value.Name,
                    ContentType = "application/json"
                };
                request.Method = service.Value.Actions.FirstOrDefault();
                if ((request.Method ?? "").Equals("ANY", StringComparison.CurrentCultureIgnoreCase))
                {
                    request.Method = "POST";
                }
                item.Base.Tags.AddRange(service.Value.Actions);

                request.Body = GetFieldModels(service.Value.RequestType);

                item.Request = request;
                #endregion

                #region Response

                var response = new Models.Postman.ResponseModel();

                response.Mode = "raw";

                response.Body = GetFieldModels(service.Value.ResponseType);

                item.Response = response;

                #endregion

                ModelData.Item.Add(item);
            }
        }

        /// <summary>
        /// 根据类型，反射所有属性，返回 FieldModel 列表
        /// </summary>
        /// <param name="type"></param>
        /// <returns></returns>
        private List<Postman.FieldModel> GetFieldModels(Type type)
        {
            var result = new List<Postman.FieldModel>();

            var reqProps = type.GetProperties();
            foreach (var propInfo in reqProps)
            {
                var fieldModel = new Models.Postman.FieldModel();
                fieldModel.FieldName = propInfo.Name;
                fieldModel.IsArray = IsArray(propInfo.PropertyType);
                fieldModel.Type = GetJsonTypeDefine(GetActualType(propInfo.PropertyType));

                var attrs = propInfo.GetCustomAttributes(typeof(ApiMemberAttribute), false);
                foreach (var attrItem in attrs)
                {
                    var apiDefine = (ApiMemberAttribute)attrItem;

                    fieldModel.FieldName = apiDefine.Name;
                    fieldModel.Description = apiDefine.Description;
                    fieldModel.IsRequired = apiDefine.IsRequired;
                }

                if (IsExistsChild(propInfo.PropertyType))
                {
                    fieldModel.ChildItem = GetFieldModels(GetActualType(propInfo.PropertyType));
                }

                result.Add(fieldModel);
            }

            return result;
        }

        // 判断类型是否属于数组
        private bool IsArray(Type type)
        {
            if (type.IsGenericType)
            {
                if (type.GetInterfaces().Contains(typeof(IList)))
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
            else
            {
                return type.IsArray;
            }
        }

        /// <summary>
        /// 获取真实的类型，如果外层是泛型则获取泛型参数里的第一个类型
        /// </summary>
        /// <param name="type"></param>
        /// <returns></returns>
        private Type GetActualType(Type type)
        {
            if (type.IsGenericType)
            {
                return type.GetGenericArguments().FirstOrDefault();
            }
            else
            {
                return type;
            }
        }

        /// <summary>
        /// json 数据类型字典
        /// </summary>
        private Dictionary<string, string> jsonDataTypeDict = new Dictionary<string, string>();

        private bool IsExistsChild(Type type)
        {
            return GetJsonTypeDefine(GetActualType(type)) == "object";
        }

        /// <summary>
        /// 获取json类型定义
        /// </summary>
        /// <param name="type"></param>
        /// <returns></returns>
        public string GetJsonTypeDefine(Type type)
        {
            var result = "xx";

            if (type.FullName.Equals(typeof(Int16).FullName)
                || type.FullName.Equals(typeof(Int32).FullName)
                || type.FullName.Equals(typeof(Int64).FullName)
                || type.FullName.Equals(typeof(float).FullName)
                || type.FullName.Equals(typeof(double).FullName)
                || type.FullName.Equals(typeof(decimal).FullName)
                )
            {
                result = "int";
            }
            else if (type.FullName.Equals(typeof(bool).FullName))
            {
                result = "boolean";
            }
            else if (type.FullName.Equals(typeof(DateTime).FullName)
                || type.FullName.Equals(typeof(string).FullName)
                )
            {
                result = "string";
            }
            else if (type.IsGenericType)
            {

            }
            else if (type.IsClass)
            {
                result = "object";
            }

            return result;
        }

        /// <summary>
        /// 获取json 格式的 稳定定义数据
        /// </summary>
        /// <returns></returns>
        public string GetJson()
        {
            return JsonConvert.SerializeObject(ModelData);
        }

    }
}
