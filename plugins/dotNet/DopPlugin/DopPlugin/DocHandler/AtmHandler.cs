using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel;
using System.Diagnostics;
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
    public class AtmHandler
    {

        ///// <summary>
        ///// json 数据类型字典
        ///// </summary>
        //private Dictionary<string, string> jsonDataTypeDict = new Dictionary<string, string>();

        public Models.AtmModel ModelData;
        public string[] FilterNames { get; set; }

        public AtmHandler(string[] filterNames)
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

            ModelData = new AtmModel();
            ModelData.Info = new Models.AtmModel.InfoModel() { Project = req.Url.Port.ToString() };

            var serviceMap = EndpointHost.Config.ServiceManager.Metadata.OperationNamesMap;
            ModelData.Item = new List<Models.AtmModel.ItemModel>();
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

                Debug.WriteLine("getter api info:" + service.Value.Name);

                var item = new Models.AtmModel.ItemModel();

                #region Base
                item.Base = new Models.AtmModel.BaseModel() { Name = service.Value.Name, Description = "### ", State = true, Tags = new ArrayOfString() };

                var serviceAttrs = service.Value.RequestType.GetCustomAttributes(typeof(DescriptionAttribute), true);
                foreach (var serviceAttr in serviceAttrs)
                {
                    if (serviceAttr is DescriptionAttribute)
                    {
                        item.Base.Description = ((DescriptionAttribute)serviceAttr).Description;
                    }
                }

                item.Base.Tags.AddRange(service.Value.Routes.Select(c => c.Path).ToList());
                #endregion

                #region Request
                var request = new Models.AtmModel.RequestModel()
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

                request.Body = new AtmModel.RequestBodyModel();

                request.Body.Mode = "raw";
                request.Body.Data = GetFieldModels(service.Value.RequestType);

                item.Request = request;
                #endregion

                #region Response

                var response = new Models.AtmModel.ResponseModel();
                
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
        private List<AtmModel.FieldModel> GetFieldModels(Type type)
        {
            var result = new List<AtmModel.FieldModel>();

            var acutalType = GetActualType(type);

            var reqProps = acutalType.GetProperties();
            foreach (var propInfo in reqProps)
            {
                var fieldModel = new Models.AtmModel.FieldModel();
                fieldModel.FieldName = propInfo.Name;
                fieldModel.IsArray = IsArray(propInfo.PropertyType);
                fieldModel.FieldType = GetJsonTypeDefine(GetActualType(propInfo.PropertyType));
                fieldModel.Default = GetJsonTypeDefaultValue(propInfo.PropertyType);

                var attrs = propInfo.GetCustomAttributes(typeof(ApiMemberAttribute), true);

                foreach (var attrItem in attrs)
                {
                    var apiDefine = (ApiMemberAttribute)attrItem;

                    if (!string.IsNullOrWhiteSpace(apiDefine.Name))
                    {
                        fieldModel.FieldName = apiDefine.Name;
                    }
                    if (!string.IsNullOrWhiteSpace(apiDefine.Description))
                    {
                        fieldModel.Description = apiDefine.Description;
                    }
                    fieldModel.IsRequired = apiDefine.IsRequired;
                }

                if (IsExistsChild(propInfo.PropertyType))
                {
                    var propActualType = GetActualType(propInfo.PropertyType);
                    if (propActualType != type)
                    {
                        fieldModel.ChildItem = GetFieldModels(propActualType);
                    }
                }

                result.Add(fieldModel);
            }

            return result;
        }

        private string GetJsonTypeDefaultValue(Type type)
        {
            if (type.IsGenericType)
            {
                return "";
            }

            var jsonType = GetJsonTypeDefine(type);
            switch (jsonType)
            {
                case "int":
                    return "0";
                case "boolean":
                    return "false";
                case "string":
                    return "";
                case "object":
                    return "";
            }
            return "";
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
                result = "number";
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
