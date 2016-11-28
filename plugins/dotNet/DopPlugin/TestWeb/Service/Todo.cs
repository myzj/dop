using System;
using System.Collections.Generic;
using System.ComponentModel;
using ServiceStack.Common;
using ServiceStack.ServiceHost;
using ServiceStack.ServiceInterface.ServiceModel;
using TestWeb.Repository;

namespace TestWeb.Service
{
    //Request DTO 
    [Route(path: "/test1", Notes = "备注", Summary = "总结")]
    [Route(path: "/test11")]
    [Description("adfasdf")]
    public class Hello
    {
        [ApiMember(Name = "name", Description = "测试的名称", IsRequired = true)]
        public string Name { get; set; }

        [ApiMember(Name = "user_id", Description = "用户id", IsRequired = true)]
        public int UserId { get; set; }

        public bool IsDelete { get; set; }

        public DateTime CreateTime { get; set; }

        public long timestamp { get; set; }

        public List<int> ids { get; set; }
    }

    public class Hello1
    {
        public string Name { get; set; }

        public int UserId { get; set; }

        public bool IsDelete { get; set; }

        public DateTime CreateTime { get; set; }

        public long timestamp { get; set; }
    }

    //Response DTO 
    public class HelloResponse
    {
        public string Name { get; set; }

        public int UserId { get; set; }

        public bool IsDelete { get; set; }

        public DateTime CreateTime { get; set; }

        public long timestamp { get; set; }

        public string Result { get; set; }
        public ResponseStatus ResponseStatus { get; set; } //Where Exceptions get auto-serialized 
    }

    //Can be called via any endpoint or format, see: http://servicestack.net/ServiceStack.Hello/ 
    public class HelloService : ServiceStack.ServiceInterface.Service
    {
        public HelloResponse Any(Hello request)
        {
            return new HelloResponse { Result = "Hello, " + request.Name };
        }

        public List<HelloResponse> Post(Hello1 request)
        {
            return null;
        }
    }

    //REST Resource DTO 
    [Route("/todos")]
    [Route("/todos/{Ids}")]
    public class Todos : IReturn<List<Todo>>
    {
        public long[] Ids { get; set; }
        public Todos(params long[] ids)
        {
            this.Ids = ids;
        }
    }

    [Route("/todos", "POST")]
    [Route("/todos/{Id}", "PUT")]
    public class Todo : IReturn<Todo>
    {
        public long Id { get; set; }
        public string Content { get; set; }
        public int Order { get; set; }
        public bool Done { get; set; }
    }

    public class TodosService : ServiceStack.ServiceInterface.Service
    {
        public TodoRepository Repository { get; set; }  //Injected by IOC

        public object Get(Todos request)
        {
            return request.Ids.IsEmpty()
                ? Repository.GetAll()
                : Repository.GetByIds(request.Ids);
        }

        public object Post(Todo todo)
        {
            return Repository.Store(todo);
        }

        public object Put(Todo todo)
        {
            return Repository.Store(todo);
        }

        public void Delete(Todos request)
        {
            Repository.DeleteByIds(request.Ids);
        }
    }

}