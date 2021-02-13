import { ref, computed } from 'vue';

export default function useModel<T>(getter: () => T, emitter: (val: T) => void) {
    const state = ref(getter()) as { value: T};

    return computed({
        get: () => state.value,
        set: (val: T) => {
            if(state.value !== val) {
                state.value = val;
                emitter(val)
            }
        }
    })
}