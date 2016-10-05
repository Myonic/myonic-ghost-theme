$(document).ready(function() {
    nextPage = 2;
    pagination = 5;
    moreToLoad = true;

    //on scroll near bottom
    $(window).scroll(function() {
        setTimeout(function() {
            if ($(window).scrollTop() + $(window).height() > $(document).height() - 10 && moreToLoad) {
                $(".ajax-message").text("Loading more...").show();
                $.ajax({
                    //go grab the pagination number of posts on the next page and include the tags
                    url: ghost.url.api('posts', {
                        limit: pagination,
                        page: nextPage,
                        include: 'tags,author'
                    }),
                    type: 'get'
                }).done(function(data) {
                    //for each post returned
                    $.each(data.posts, function(i, post) {
                        insertPost(post);
                    });
                    $(".ajax-message").text("").hide();
                }).fail(function(err) {
                    console.error(err);
                    moreToLoad = false;
                });
            }
        }, 3000)
    });

    function insertPost(postData) {
        //start the inserting of the html
        var monthNames = [
            "January", "February", "March",
            "April", "May", "June", "July",
            "August", "September", "October",
            "November", "December"
        ];
        var date = new Date(postData.published_at);
        var day = date.getDate();
        var monthIndex = date.getMonth();
        var year = date.getFullYear();
        var image;
        if (postData.image == null) {
            image = "https://unsplash.it/1920/1080/?random&blur"
        } else {
            image = postData.image
        }
        var postInfo = '<article class="post" style="background-image:url(' + image + ')">\
        <a href="' + postData.url + '">\
              <div class="overlay">\
                <header class="post-header">\
                    <h2 class="post-title">' + postData.title + '</h2>\
                </header>\
            </section>\ <footer class="post-meta">'

        //if no author image, dont include it
        // if (postData.author.image != null) {
        //     postInfo += '<img class="author-thumb" src="' + postData.author.image + '" alt="' + postData.author.name + '" nopin="nopin" />'
        // }

        //if there are tags, add each of them to the post
        // if (postData.tags.length > 0) {
        //     for (i = 0; i < postData.tags.length; i++) {
        //         console.log(postData.tags[i]);
        //         // postInfo += '<a href="/author/' + postData.author.slug + '">' + postData.author.name + '</a>' + ' on '
        //         postInfo += '<a href="/tag/' + postData.tags[i].slug + '">' + postData.tags[i].name + "</a> ";
        //     }
        // }
        // } else {
        //     //if no tags, just add the author name
        //     postInfo += '<a href="/author/' + postData.author.slug + '">' + postData.author.name + '</a>';
        // }

        //Finish off the html with the time
        //The format for the time will be different, you will have to figure this out
        postInfo += '&nbsp<time class="post-date" datetime="' + postData.published_at + '">' + monthNames[monthIndex] + ' ' + day + ', ' + year + '</time>\
                </footer>\
                </div>\
                </a>\
            </article>'

        //Append the html to the content of the blog
        $('.content').append(postInfo);
        //incriment next page so it will get the next page of posts if hit again.
        nextPage += 1;
    }
});
