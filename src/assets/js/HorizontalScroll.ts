import { onMounted, onUnmounted, ref } from "vue";

export const useHorizontalScroll = () => {
    const scrollRef = ref<HTMLDivElement>(null);

    const handleScroll = (e) => {
        e.preventDefault(); // 阻止默认滚动行为
        if (scrollRef.value && e.deltaY !== 0) {
            scrollRef.value.scrollLeft += e.deltaY; // 注意这里只加了 deltaY 来控制横向滚动
            // 如果想同时考虑 deltaX，可以适当调整这里的逻辑
        }
    };

    onMounted(() => {
        if (scrollRef.value) {
            scrollRef.value.addEventListener('wheel', handleScroll, { passive: false });
        }
    });

    onUnmounted(() => {
        if (scrollRef.value) {
            scrollRef.value.removeEventListener('wheel', handleScroll);
        }
    });

    return {
        scrollRef,
    };
};