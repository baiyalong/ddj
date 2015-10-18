/**
 * Created by bai on 2015/10/18.
 */
var dll = {

    IMDbEcStatorCal2: function (design) {
        var root = $('#' + design).tree('getRoot');
        var data = $('#' + design).tree('getData', root.target);
        $.post('/api/dll/IMDbEcStatorCal2', {
            user: user.user.name,
            project: project.name,
            design: design,
            timestamp: new Date(),
            Pn_: parseInt(data.children[5].attributes.property[0].value),
            I1_: parseInt(data.children[5].attributes.property[1].value),
            M_: data.children[0].children[0].attributes.property[0].value,
            P_: data.children[0].children[0].attributes.property[1].value,
            U_: parseInt(data.children[5].attributes.property[2].value),
            F_: parseInt(data.children[5].attributes.property[3].value),
            DI1_: parseInt(data.children[0].children[1].attributes.property[1].value),
            SCL_: parseInt(data.children[0].children[1].attributes.property[2].value),
            Q1_: parseInt(data.children[0].children[1].attributes.property[5].value),
            NK1_: parseInt(data.children[0].children[1].attributes.property[13].value),
            BK1_: parseInt(data.children[0].children[1].attributes.property[14].value),
            SSlotType_: (function (s) {
                var res = 0;
                switch (s) {
                    case '全开口矩形槽':
                        res = 1;
                        break;
                    case '半开口矩形槽':
                        res = 2;
                        break;
                    case '半开口圆底槽':
                        res = 3;
                        break;
                }
                return res;
            })(data.children[0].children[1].attributes.property[6].value),
            BS0_: parseInt(data.children[0].children[1].attributes.property[10].value),
            BS1_: parseInt(data.children[0].children[1].attributes.property[11].value),
            BS2_: parseInt(data.children[0].children[1].attributes.property[12].value),
            HS0_: parseInt(data.children[0].children[1].attributes.property[7].value),
            HS1_: parseInt(data.children[0].children[1].attributes.property[8].value),
            HS2_: parseInt(data.children[0].children[1].attributes.property[9].value),
            DO2_: parseInt(data.children[0].children[3].attributes.property[0].value),
            RCL_: parseInt(data.children[0].children[3].attributes.property[2].value),
            Q2_: parseInt(data.children[0].children[3].attributes.property[5].value),
            NK2_: parseInt(data.children[0].children[3].attributes.property[15].value),
            BK2_: parseInt(data.children[0].children[3].attributes.property[16].value),
            BSK_: parseInt(data.children[0].children[3].attributes.property[18].value),
            RSlotType_: (function (s) {
                var res = 0;
                switch (s) {
                    case 'A型槽':
                        res = 1;
                        break;
                    case 'B型槽':
                        res = 2;
                        break;
                    case 'C型槽':
                        res = 3;
                        break;
                    case 'D型槽':
                        res = 4;
                        break;
                    case 'E型槽':
                        res = 5;
                        break;
                    case 'F型槽':
                        res = 6;
                        break;
                    case 'G型槽':
                        res = 7;
                        break;
                    case 'H型槽':
                        res = 8;
                        break;
                }
                return res;
            })(data.children[0].children[3].attributes.property[6].value),
            BR0_: parseInt(data.children[0].children[3].attributes.property[10].value),
            BR1_: parseInt(data.children[0].children[3].attributes.property[11].value),
            BR2_: parseInt(data.children[0].children[3].attributes.property[12].value),
            BR3_: parseInt(data.children[0].children[3].attributes.property[13].value),
            BR4_: parseInt(data.children[0].children[3].attributes.property[14].value),
            HR0_: parseInt(data.children[0].children[3].attributes.property[7].value),
            HR1_: parseInt(data.children[0].children[3].attributes.property[8].value),
            HR2_: parseInt(data.children[0].children[3].attributes.property[9].value),
            DETAG1_: parseInt(data.children[0].children[2].attributes.property[14].value),
            dSWedgeDw_: parseInt(data.children[5].attributes.property[4].value),
            dSLineBot_: parseInt(data.children[5].attributes.property[5].value),
            AA1_: parseInt(data.children[0].children[2].attributes.property[11].value),
            LL_: parseInt(data.children[0].children[2].attributes.property[12].value),
            CLB_: parseInt(data.children[0].children[4].attributes.property[0].value),
            DR_: parseInt(data.children[0].children[4].attributes.property[1].value),
            JC_: (function (s) {
                var res = 0;
                switch (s) {
                    case '星型':
                        res = 0;
                        break;
                    case '角型':
                        res = 1;
                        break;
                }
                return res;
            })(parseInt(data.children[0].children[2].attributes.property[1].value)),
            Z1_: parseInt(data.children[0].children[2].attributes.property[3].value),
            A1_: parseInt(data.children[0].children[2].attributes.property[2].value),
            Y1_: parseInt(data.children[0].children[2].attributes.property[4].value),
            Me_: parseInt(data.children[5].attributes.property[6].value),
            Ae_: parseInt(data.children[5].attributes.property[7].value),
        }, function (data, status) {
            console.log(data, status)
        })

    },
    IMEmEcSteadCal2:function(){},
    IMEmEcTransCal2:function(){},
    IMEmSzTransCal2:function(){},
    IMEmSzTransMesh2:function(){},
    IMMeEcStatorCal2:function(){},
    IMMeSzStatorCal2:function(){},
    IMPredictFr2:function(param){

        $.post('/api/dll/IMPredictFr2',{
            user: user.user.name,
            project: project.name,
            design: '',
            timestamp: new Date(),
            P:param.P,
            F:param.F,
            Q1:param.Q1,
            Q2:param.Q2,
            N_r:param.N_r,
            Frmax:param.Frmax
        },function(data,status){
            console.log(data,status)
        })
    }
}