
export const setRoomListHeightWithCalc = async (overflowRef, parentRef) => {
    if (overflowRef.value && parentRef.value) {
        let otherElementsHeight = 0;
        const parentHeight = parentRef.value.offsetHeight; // 获取父容器的高度
        console.log(parentHeight,'父高度');
        // 遍历所有兄弟元素（除了 .roomList）并累加它们的高度
        Array.from(parentRef.value.children).forEach(child => {
            if (child !== overflowRef.value) {
                otherElementsHeight += child.offsetHeight;
                console.log(otherElementsHeight, '兄弟高度');
            }
        });

        // 使用 calc 函数设置 .roomList 的高度
        overflowRef.value.style.height = `calc(${parentHeight}px - ${otherElementsHeight}px)`;
        console.log(overflowRef.value.style.height,'剩余高度');
    }
};