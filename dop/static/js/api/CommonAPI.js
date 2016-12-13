define('api/CommonAPI', ['model/token', 'lib/cookie'], function (token, cookie) {
    var userobj = token.getUserInfo();
    if (cookie.get('_displaylabelids') == "" || cookie.get('_displaylabelids') == null) {
        cookie.add('_displaylabelids', ["8"], '/', 86400 * 1);
    }
    userobj.DisplayLabel = JSON.stringify(cookie.get('_displaylabelids').split(","));

    return {
        commonObj: {
            UserId: userobj.UserId || 0,
            Guid: userobj.UserGuid ||"",
            DisplayLabel: userobj.DisplayLabel || "",
            SourceTypeSysNo:2,
            ExtensionSysNo: userobj.ExtensionSysNo || "",
            AreaSysNo: userobj.AreaSysNo || "",
            ChannelID: userobj.ChannelID || "",
            ClientIp: userobj.ClientIp || "",
        }
    }
});
