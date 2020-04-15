console.log('hello world!');

$.ajax({
    url: 'http://localhost:3000/places/',
    success: (data) => {
        console.log(data);
    },
    error: () => {
        console.log('Get tickets error!');
    },
});
