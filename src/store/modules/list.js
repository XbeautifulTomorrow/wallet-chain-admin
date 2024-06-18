const list = {
    state: {
        /*选中数据 */
        list: { //列表数据
            listActived: null, //选中的列表
            imgUrl: ""
        },
        rules: {
            code: [{
                required: true,
                message: ' ',
                trigger: 'changes' || 'blur'
            }]
        },
        /*弹窗显示 */
        showAddDialog: false, // 是否显示新增弹窗
        showEditDialog: false, // 是否显示修改弹窗
        showDelDialog: false, // 是否显示删除弹窗

        /*分页参数*/
        total: 0, //数据总数
        start: 1, //分页开始条数
        limit: 10 //查询的条数
    },
    mutations: {
        ADD(state) { //打开新增窗口
            state.showAddDialog = true;
        },
        CLOSEADD(state) {
            state.showAddDialog = false; //关闭新增窗口
        },

        EDIT(state) { //显示编辑窗口
            // console.log(state.list);
            // if (!state.list.listActived) {
            //   Message.warning('请选择要编辑的列表后重试')
            //   return false
            // }
            // if (state.list.listActived.length == 1) {
            state.showEditDialog = true;
            // } else if (state.list.listActived.length > 1) {
            //   Message.warning('有且仅能选择一项进行编辑')
            //   return false
            // }
        },

        //关闭编辑窗口
        CLOSTEDIT(state) {
            state.showEditDialog = false;
        },
    },
    actions: {
        add({
            commit
        }) { //抛出方法 打开新增窗口
            commit('ADD')
        },
        closeAdd({
            commit
        }) { //抛出方法 关闭新增窗口和编辑窗口
            commit('CLOSEADD')
        },
        edit({
            commit
        }) { //抛出方法 打开编辑窗口
            commit('EDIT')
        },
        closeEdit({
            commit
        }) { //抛出方法 打开编辑窗口
            commit('CLOSTEDIT')
        }
    }
}
export default list