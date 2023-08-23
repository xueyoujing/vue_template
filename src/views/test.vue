<template>
    <el-table :data="tableData" style="width: 100%">
        <el-table-column label="ID" prop="id"></el-table-column>
        <el-table-column label="名称" prop="name"></el-table-column>
    </el-table>
</template>

<script>
import { ref } from 'vue'

export default {
    name: "TestPage",
    setup() {
        let tableData = ref([]);

        return {
            tableData
        }
    }
}
</script>
