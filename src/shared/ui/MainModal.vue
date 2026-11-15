<script setup lang="ts">
import { ref, watchPostEffect } from "vue";

const props = defineProps<{ isOpen: boolean; labelledBy: string }>();
const emit = defineEmits<{ close: [] }>();
const dialogRef = ref<HTMLDialogElement | null>(null);
let backdropPointerDown = false;

// Post-flush ensures both the dialog and its conditional slot content exist.
// Vue runs this cleanup when the dialog closes and when it unmounts.
watchPostEffect((onCleanup) => {
  const dialog = dialogRef.value;
  if (!props.isOpen || !dialog) {
    return;
  }

  const previousFocus = document.activeElement;
  const previousOverflow = document.body.style.overflow;
  document.body.style.overflow = "hidden";
  if (!dialog.open) {
    dialog.showModal();
  }

  onCleanup(() => {
    if (dialog.open) {
      dialog.close();
    }
    document.body.style.overflow = previousOverflow;
    backdropPointerDown = false;
    if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
      previousFocus.focus();
    }
  });
});

function isOutsideDialog(clientX: number, clientY: number) {
  const bounds = dialogRef.value?.getBoundingClientRect();
  return bounds
    ? clientX < bounds.left ||
        clientX > bounds.right ||
        clientY < bounds.top ||
        clientY > bounds.bottom
    : false;
}

function onPointerDown(event: PointerEvent) {
  backdropPointerDown =
    event.target === event.currentTarget &&
    isOutsideDialog(event.clientX, event.clientY);
}

function onClick(event: MouseEvent) {
  if (
    backdropPointerDown &&
    event.target === event.currentTarget &&
    isOutsideDialog(event.clientX, event.clientY)
  ) {
    emit("close");
  }
  backdropPointerDown = false;
}
</script>

<template>
  <Teleport to="body">
    <dialog
      ref="dialogRef"
      class="main-dialog"
      :aria-labelledby="labelledBy"
      @cancel.prevent="emit('close')"
      @pointerdown="onPointerDown"
      @click="onClick"
    >
      <slot />
    </dialog>
  </Teleport>
</template>
