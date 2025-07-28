const mobile = (rule, value, callback) => {
    const reg = /^[1][2,3,4,5,6,7,8,9][0-9]{9}$/;
    if (reg.test(value)) {
        callback();
    } else {
        callback(new Error("手机号格式不正确"));
    }
};
const length5 = (rule, value, callback) => {
    if (value.length === 0) {
        callback(new Error("请选择"));
    } else if (value.length < 6) {
        callback();
    } else {
        callback(new Error("最多选取5个请去除多余选项"));
    }
};
const patentRule = (rule, value, callback) => {
    if (value.length === 0) {
        callback(new Error("请添加新闻"));
    } else if (!value.length > 5 || (value.length === 0)) {
        callback(new Error("最少一个新闻最多五个新闻"));
    } else {
        callback();
    }
};
const extractFieldsRule = (rule, value, callback) => {
    if (value.length === 0) {
        callback(new Error("请添加抽取字段"));
    } else if (value.length === 1 && value[0].extractSample === '') {
        callback(new Error("请填写抽取字段对应字段内容"));
    }else if (!isAllHaveContent(value)) {
        callback(new Error("请填写每一个抽取字段对应字段内容"));
    } else {
        callback();
    }
};

/**
 * 所有数组元素最多为5
 * @param arr
 */
// function isAllLength5(arr) {
//     return !(arr.some(i => {
//         return  i.patents.length > 5 || (i.patents.length === 0)
//     }))
// }
/**
 * 所有数组元素都有内容
 * @param arr
 */
function isAllHaveContent(arr) {
    return !(arr.some(i => {
        return i.extractSample === ''
    }))
}

const number = (rule, value, callback) => {
    // console.log(Number(value));
    // console.log(isNaN(value));
    if (!value) {
        callback(new Error("填写不能为空"));
        // }else if((typeof value === String && value.indexOf(".") !== -1 && value.split('.').length > 2) || !parseFloat(value) || parseFloat(value).toString() !== value){
    } else if (isNaN(value)) {
        callback(new Error("请输入正确格式的数字")); //防止输入多个小数点
    } else {
        callback();
    }
};
const numberzero = (rule, value, callback) => {
    // console.log(Number(value));
    // console.log(isNaN(value));
    if (!value && value !== 0) {
        callback(new Error("填写不能为空"));
        // }else if((typeof value === String && value.indexOf(".") !== -1 && value.split('.').length > 2) || !parseFloat(value) || parseFloat(value).toString() !== value){
    } else if (isNaN(value)) {
        callback(new Error("请输入正确格式的数字")); //防止输入多个小数点
    } else {
        callback();
    }
};
const email = (rule, value, callback) => {
    const reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
    if (reg.test(value)) {
        callback();
    } else {
        callback(new Error("邮箱格式不正确"));
    }
};

const age = (rule, value, callback) => {
    const number = Number(value);
    if (number < 1 || number > 150) {
        callback(new Error("年龄不正确"));
    } else {
        callback();
    }
};

const upload = (rule, value, callback) => {
    if (!value || value === "" || value.length === 0) {
        callback(new Error("请上传"));
    } else {
        callback();
    }
};

const emptyRich = "<p><br></p>";
const richText = (rule, value, callback) => {
    if (!value || value === emptyRich) {
        callback(new Error("内容不能为空"));
    } else {
        callback();
    }
};

export default {
    data() {
        return {
            rule: {
                input: {required: true, message: "请输入", trigger: "blur"},
                inputNumber: [
                    {
                        type: "string",
                        required: true,
                        trigger: "blur",
                        validator: number,
                    },
                ],
                inputNumberContainZero: [
                    {
                        type: "string",
                        required: true,
                        trigger: "blur",
                        validator: numberzero,
                    },
                ],
                upload: {
                    required: true,
                    validator: upload,
                    trigger: ["blur", "change"],
                },
                select: {required: true, message: "请选择", trigger: "change"},
                select5: [
                    {required: true, validator: length5, trigger: "change"},
                ],
                patentRule: [
                    {required: true, validator: patentRule, trigger: "blur"},
                ],
                extractFieldsRule: [
                    {required: true, validator: extractFieldsRule, trigger: "blur"},
                ],
                treeselect: {required: true, message: "请选择", trigger: "change"},
                cascader: {required: true, message: "请选择", trigger: "change"},
                multiSelect: {
                    type: "array",
                    required: true,
                    message: "请选择",
                    trigger: "change",
                },
                date: {
                    // type: "date",
                    required: true,
                    message: "请选择日期",
                    trigger: "change",
                },
                datetime: {
                    // type: "datetime",
                    required: true,
                    message: "请选择时间",
                    trigger: "change",
                },
                mobile: {required: true, validator: mobile, trigger: "blur"},
                email: {required: true, validator: email, trigger: "blur"},
                age: {required: true, validator: age, trigger: "blur"},
                richText: {
                    required: true,
                    validator: richText,
                    trigger: "change",
                },
            },
        };
    },
};
