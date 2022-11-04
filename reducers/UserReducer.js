
export const UserReducer = (state, action) => {
    switch (action.type) {
        case 'add':
            return [...state, action.payload];
        case 'remove':
        case 'delete':
            console.log('remove', action.payload);
            return state.filter(({ id }) => id !== action.payload);
        case 'update':
            return state.map((item) => {
                if (item.id === action.payload.id) {
                    return action.payload;
                }
                return item;
            });
        default:
            return state;
    }
};

export default UserReducer;
