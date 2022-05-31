let trash = document.getElementsByClassName("delete");

document.querySelector(".deleteImg").addEventListener('click', function(){
  console.log('hi')
  fetch('/profile', {
    method: 'delete',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
    })
  }).then(function (response) {
    window.location.reload(true)
  })
});

Array.from(trash).forEach(function(element) {
  element.addEventListener('click', function(){
    fetch('/deleteImg', {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
      })
    }).then(function (response) {
      window.location.reload()
    })
  });
});
