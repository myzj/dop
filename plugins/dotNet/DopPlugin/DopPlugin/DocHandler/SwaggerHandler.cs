using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace DopPlugin.DocHandler
{
    public class SwaggerHandler
    {
        public SwaggerHandler()
        {
            
        }

        public GanerateDocHandler()
        {
            jsonDataTypeDict.Add(typeof(bool).FullName, "boolean");
            jsonDataTypeDict.Add(typeof(DateTime).FullName, "string");
            jsonDataTypeDict.Add(typeof(Int16).FullName, "int");
            jsonDataTypeDict.Add(typeof(Int32).FullName, "int");
            jsonDataTypeDict.Add(typeof(Int64).FullName, "int");
            jsonDataTypeDict.Add(typeof(float).FullName, "int");
            jsonDataTypeDict.Add(typeof(double).FullName, "int");
            jsonDataTypeDict.Add(typeof(decimal).FullName, "int");
        }


        private static readonly Dictionary<Type, string> valueTypeDic = new Dictionary<Type, string> {
            {typeof(byte), FieldType.Byte},
            {typeof(sbyte), FieldType.Byte},
            {typeof(bool), FieldType.Boolean},
            {typeof(short), FieldType.Int},
            {typeof(ushort), FieldType.Int},
            {typeof(int), FieldType.Int},
            {typeof(uint), FieldType.Int},
            {typeof(long), FieldType.Long},
            {typeof(ulong), FieldType.Long},
            {typeof(float), FieldType.Float},
            {typeof(double), FieldType.Double},
            {typeof(decimal), FieldType.Double},
            {typeof(string), FieldType.String},
            {typeof(DateTime), FieldType.Date}
        };

        private static List<string> allType = new List<string>()
        {
            FieldType.Byte,
            FieldType.Boolean,
            FieldType.Int,
            FieldType.Long,
            FieldType.Float,
            FieldType.Double,
            FieldType.String,
            FieldType.Date
        };

        private static Type parentType = null;

        private static Dictionary<string, Model> ModelList = new Dictionary<string, Model>();

        #region <<转化swagger>>

        /// <summary>
        /// 转换为swagger
        /// </summary>
        /// <param name="dll"></param>
        /// <returns></returns>
        public SwaggerHandler ConvertServiceToSwagger(List<Service> dll)
        {
            var list = new SwaggerHandler();
            foreach (var service in dll)
            {
                var path = new SwaggerPath();
                //请求参数
                path.parameters = new List<SwaggerParam>()
                {
                    new SwaggerParam()
                    {
                        In = SwaggerParamInEnum.Body,
                        description = "",
                        name = "request",
                        required = true,
                        schema = service.RequestModel.TypeModel != null
                            ? new SwaggerPro()
                            {
                                ModelName = service.RequestModel.Type
                            }
                            : new SwaggerPro()
                            {
                                type = service.RequestModel.Type
                            }
                    }
                };
                //响应参数
                path.responses = new Dictionary<string, SwaggerResponse>()
                {
                    {
                        "200", new SwaggerResponse()
                    }
                };
                if (service.ResponseModel.TypeModel != null)
                {
                    path.responses["200"].schema = new SwaggerPro() { ModelName = service.ResponseModel.FieldName };
                }
                else
                {
                    if (service.ResponseModel.IsArray)
                    {
                        path.responses["200"].schema = new SwaggerSchemaAry()
                        {
                            type = FieldType.Array,
                            items = new SwaggerPro() { ModelName = service.ResponseModel.FieldName }
                        };
                    }
                    else
                    {
                        path.responses["200"].schema = new SwaggerPro() { type = service.ResponseModel.FieldName };
                    }
                }
                //模型
                if (service.RequestModel.TypeModel != null)
                {
                    foreach (var definion in ConverDefinions(service.RequestModel))
                    {
                        if (!list.definitions.ContainsKey(definion.Key))
                            list.definitions.Add(definion.Key, definion.Value);
                    }
                }
                if (service.ResponseModel.TypeModel != null)
                {
                    foreach (var definion in ConverDefinions(service.ResponseModel))
                    {
                        if (!list.definitions.ContainsKey(definion.Key))
                            list.definitions.Add(definion.Key, definion.Value);
                    }
                }

                list.paths.Add(service.ActionName, new Dictionary<string, SwaggerPath>()
                {
                    {
                        ConverToHttpMethod(service.HttpMethod),path
                    }
                });


            }
            return list;

        }

        /// <summary>
        /// 转换类
        /// </summary>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        public Dictionary<string, SwaggerDefinion> ConverDefinions(Field model)
        {
            var dic = new Dictionary<string, SwaggerDefinion>();
            var definion = new SwaggerDefinion() { properties = new Dictionary<string, SwaggerPro>() };
            foreach (var field in model.TypeModel.Fields)
            {
                SwaggerPro schema;
                if (field.IsArray)
                {
                    schema = new SwaggerSchemaAry()
                    {
                        type = FieldType.Array,
                        items = new SwaggerPro()
                    };
                    ConverPro(field, ((SwaggerSchemaAry)schema).items, dic);
                }
                else
                {
                    schema = new SwaggerPro();
                    ConverPro(field, schema, dic);
                }
                definion.properties.Add(field.FieldName, schema);
            }
            if (!dic.ContainsKey(model.Type))
                dic.Add(model.Type, definion);
            return dic;
        }

        public void ConverPro(Field field, SwaggerPro schema, Dictionary<string, SwaggerDefinion> dic)
        {
            if (field.TypeModel == null)
            {
                schema.type = field.Type;
            }
            else
            {
                schema.ModelName = field.Type;
                foreach (var item in ConverDefinions(field))
                {
                    if (!dic.ContainsKey(item.Key))
                        dic.Add(item.Key, item.Value);
                }
            }
        }


        #endregion

        #region <<解析类型>>

        public string ConverToHttpMethod(string method)
        {
            method = method.ToLower();
            switch (method)
            {
                case "any": method = "post"; break;
                default: break;
            }
            return method;
        }

        /// <summary>
        /// 转换可识别实体
        /// </summary>
        /// <param name="type"></param>
        /// <returns></returns>
        public Model ConverModel(Type type)
        {
            var model = new Model();
            if (ModelList.ContainsKey(type.FullName))
            {
                model = ModelList[type.FullName];
            }
            else
            {
                //标识父类 防止引用当前类造成死循环解决循环引用问题
                parentType = type;
                foreach (var pro in type.GetProperties())
                {
                    model.Fields.Add(ConvertProToModel(pro));
                }
                ModelList.Add(type.FullName, model);
            }
            return model;
        }

        /// <summary>
        /// 转化字段
        /// </summary>
        /// <param name="pro"></param>
        /// <returns></returns>
        public Field ConvertProToModel(PropertyInfo pro)
        {
            var field = new Field() { FieldName = pro.Name };

            var type = pro.PropertyType;
            //是否集合
            field.IsArray = type.IsArray ||
                (type.IsGenericType && new List<Type>() { typeof(List<>), typeof(IList<>), typeof(IEnumerable<>) }.Contains(type.GetGenericTypeDefinition()));
            if (field.IsArray)
            {
                var elementType = type.GetElementType() ?? type.GetGenericArguments()[0];
                type = elementType;
            }
            //字段是否可空
            field.IsNull = Nullable.GetUnderlyingType(type) != null;

            var lookupType = Nullable.GetUnderlyingType(type) ?? type;
            if (valueTypeDic.ContainsKey(lookupType))
            {
                //基础值类型
                field.Type = valueTypeDic[lookupType];
            }
            else
            {
                //枚举类型
                if (type.IsEnum)
                {
                    field.Type = type.Name;
                    field.IsEnum = true;
                    field.EnumValue = new List<string>();
                    foreach (var value in Enum.GetValues(type))
                    {
                        field.EnumValue.Add(value.ToString());
                    }
                }
                if (type.IsGenericType)
                {
                    var typeArgus = type.GetGenericArguments();
                    if (typeArgus != null && typeArgus.Count() > 0)
                    {
                        string argName = "";
                        for (int i = 0; i < typeArgus.Count(); i++)
                        {
                            argName += typeArgus[i].Name + ",";
                        }
                        field.Type = type.GetGenericTypeDefinition().Name + "<" +
                                     argName.Substring(0, argName.Length - 1) + ">";
                    }
                }
                if (string.IsNullOrWhiteSpace(field.Type))
                {
                    field.Type = type.Name;
                    //认定为一个类
                    if (type.GetProperties() != null && type.GetProperties().Count() > 0)
                    {
                        if (type != parentType)
                            field.TypeModel = ConverModel(type);
                        else
                            field.IsParentType = true;
                    }
                }
            }
            return field;
        }

        #endregion

    }
}
