<script lang="ts">
    let klass = "";
    export { klass as class };

    export let height = "";

    export let disabled = false;
</script>

<style>
    button:hover:not(:disabled) {
        transform: translateY(-2px);
        @apply hover:shadow-md;
    }

    button.disabled {
        @apply bg-gray-400;
        cursor: initial;
    }
</style>

<button
    on:click
    {disabled}
    class:disabled={disabled}
    class="{height || 'h-9'} rounded-md float-right font-semibold px-4 transition-all {klass || 'text-white bg-blue-700 hover:bg-blue-500'}"
>
    <slot />
</button>
