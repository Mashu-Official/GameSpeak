<template>
    <div class="flex flex-row space-x-2">
        <div class="flex flex-1 justify-evenly items-center  card ViewCard mt-1 mb-2 cursor-pointer py-1 box-border border-2 border-green-600"
             @click="isOpenModal = !isOpenModal">
            <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="6" y="6" width="36" height="36" rx="3" fill="none" stroke="currentColor"
                      stroke-width="4"
                      stroke-linejoin="round"/>
                <path d="M24 16V32" stroke="currentColor" stroke-width="4" stroke-linecap="round"
                      stroke-linejoin="round"/>
                <path d="M16 24L32 24" stroke="currentColor" stroke-width="4" stroke-linecap="round"
                      stroke-linejoin="round"/>
            </svg>
            <span class=" font-bold">
                       新增房间
                   </span>
        </div>
        <div class="card flex flex-row justify-center items-center font-bold ViewCard mt-1 mb-2 cursor-pointer box-border border-2 border-red-600">
            删除
        </div>
    </div>
</template>

<script>
export default {
    name: "ListCard_behavior"
}
</script>

<style scoped>

</style>