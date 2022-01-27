module.exports = {
    randomString: function(e=6) {    
        e = e;
        var t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678",
        a = t.length,
        n = "";
        for (i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
        return n
    }
}