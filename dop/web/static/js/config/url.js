define('config/url', function () {
    var self = this;

    return (function () {
    /*
        var mkmsDomain = '//mkms.api.beta.muyingzhijia.com/';
        var buyApi = "//buy.api.beta.muyingzhijia.com/";
        var webApi = "//web.api.beta.muyingzhijia.com/";
        var imgUrl = "//img.boodoll.cn/";
        var newWebUrl = "//wap.muyingzhijia.com:8003/";*/

        var dopWebUrl = "http://192.168.60.21:8050/";
        var login = dopWebUrl + "api/req_login";
        var req_team_list = dopWebUrl + "api/req_team_list";



        //秒杀接口，页面初始化时加载
        var secskillMyList = buyApi + "json/reply/MjsList";
        //秒杀页面根据不同时间段，调用对应的接口；
        var secskillListByTime =  buyApi + "json/reply/MjsSingle";
        //会员专享页面接口
        var vipexcpricelist = newWebUrl +"sales/api/query_vip_goods_by_level/";
        //会员专享加入购物车
        var vipexcpriceaddcart = newWebUrl +"sales/api/vip_club_add_cart/";
        //母婴团我要开团的方法
        var createGroup = newWebUrl +"sales/api/create_group/";
        //母婴团我要参团的方法
        var joinTeam = newWebUrl +"sales/api/join_team/";
        //获取广告模块接口
        var loadModuleDate = webApi + "api/GetAdModuleData";
        //获取图片详情
        var getGoodsDetail = mkmsDomain + "json/reply/GoodsDetail";
        //砍价团首页列表数据
         var bargainGoodsList = mkmsDomain +  "json/reply/GoodsList";
        //砍价团参团页面数据获取
        var inviteFriends =  mkmsDomain + "json/reply/InviteFriends";
        //砍价团实时播报
        var getBroadCast =  mkmsDomain + "json/reply/GetBroadCast";
        // 我的母婴团列表信息
        var getMyBargainList = newWebUrl +"sales/api/my_group_list/";
        //邀请好友 获取邀请达人
        var getInviteDoyen = mkmsDomain + 'json/reply/GetShareGeniusListReq';
        //邀请好友 我的小伙伴
        var getInviteMyShareFriends = mkmsDomain + 'json/reply/GetMyShareFriendListReq';
        //邀请好友 抵扣券、宝贝币
        var GetPrizeInfoReq = mkmsDomain + 'json/reply/GetPrizeInfoReq';
        //抽奖
        var LuckDraw = newWebUrl + "sales/api/get_lottery";
        //参与人数统计
        var GetDrawAwardUserCountReq = mkmsDomain + 'json/reply/GetDrawAwardUserCountReq';
        //剩余次数
        var GetUserDrawCountReq = mkmsDomain + 'json/reply/GetUserDrawCountReq';
        //抽奖结果
        var UserDrawAwardRecordReq = mkmsDomain + 'json/reply/UserDrawAwardRecordReq';
        //弹幕数据
        var DrawAwardTipsReq = mkmsDomain + 'json/reply/DrawAwardTipsReq';
        //拆红包
        var OpenRedPackets = mkmsDomain + 'json/reply/OpenRedPackets';
        //获取分享人的头像昵称
        var AppSelectMemberHead = newWebUrl + 'sales/api/get_member_header';
        //获取签到数据
        var queryMemberSignRecord = newWebUrl + "sales/api/query_member_sign_record/";
        //获取用户信息，包括用户头像
        var getMemberInfo = newWebUrl + "sales/api/get_member_info";
        //签到
        var memberSign = newWebUrl + "sales/api/member_sign/";
        //签到获取宝贝币、红包
        var memberGetinfo = newWebUrl + "sales/api/member_getinfo/";
        var re = {
            login:login,



            imgUrl:imgUrl,
            secskillMyList:secskillMyList,
            secskillListByTime:secskillListByTime,
            vipexcpricelist:vipexcpricelist,
            loadModuleDate:loadModuleDate,
            getGoodsDetail:getGoodsDetail,
            vipexcpriceaddcart:vipexcpriceaddcart,
            bargainGoodsList:bargainGoodsList,
            getInviteDoyen:getInviteDoyen,
            getInviteMyShareFriends:getInviteMyShareFriends,
            createGroup: createGroup,
            inviteFriends: inviteFriends,
            getMyBargainList: getMyBargainList,
            getBroadCast: getBroadCast,
            joinTeam: joinTeam,
            LuckDraw:LuckDraw,
            GetPrizeInfoReq:GetPrizeInfoReq,
            GetUserDrawCountReq:GetUserDrawCountReq,
            GetDrawAwardUserCountReq:GetDrawAwardUserCountReq,
            UserDrawAwardRecordReq:UserDrawAwardRecordReq,
            DrawAwardTipsReq:DrawAwardTipsReq,
            OpenRedPackets:OpenRedPackets,
            queryMemberSignRecord: queryMemberSignRecord,
            memberSign: memberSign,
            getMemberInfo: getMemberInfo,
            AppSelectMemberHead:AppSelectMemberHead,
            memberGetinfo:memberGetinfo
        };
        return re;
    }).call(self);
})
