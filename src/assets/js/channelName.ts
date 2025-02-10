import { ref } from 'vue';

// 定义 serverNameElement 作为响应式引用
let serverNameElement = ref<HTMLElement | null>(null);

/**
 * 显示服务器名称提示
 * @param event 鼠标事件
 * @param serverName 服务器名称
 */
export function showChannelName(event: MouseEvent, serverName: string) {
    if (!serverNameElement.value) {
        serverNameElement.value = document.createElement('div');
        if (serverNameElement.value) {
            serverNameElement.value.classList.add('serverName');
            document.body.appendChild(serverNameElement.value);
        }
    }

    if (serverNameElement.value) {
        serverNameElement.value.textContent = serverName;
        const avatarElement = event.currentTarget as HTMLElement;
        const avatarRect = avatarElement.getBoundingClientRect();

        // 设置 .serverName 的高度
        serverNameElement.value.style.height = `${avatarRect.height / 2}px`;
        // 计算 .serverName 的位置，使其位于 .avatar 的右侧并垂直居中
        serverNameElement.value.style.left = `${avatarRect.right + window.scrollX + 8}px`;
        serverNameElement.value.style.top = `${avatarRect.top + window.scrollY + (avatarRect.height - parseFloat(serverNameElement.value.style.height)) / 2}px`;

        serverNameElement.value.style.opacity = '1';
    }
}

/**
 * 隐藏服务器名称提示
 */
export function hideChannelName() {
    if (serverNameElement.value) {
        serverNameElement.value.style.opacity = '0';
        // setTimeout(() => {
            if (serverNameElement.value) {
                serverNameElement.value.remove();
                serverNameElement.value = null;
            }
        // }, 300); // 等待过渡效果完成后再移除元素
    }
}