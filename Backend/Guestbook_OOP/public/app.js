$(document).ready(function() {
    // Load initial comments
    loadComments();

    // Handle form submission
    $('#comment-form').on('submit', function(e) {
        e.preventDefault();
        $('#error-message').hide();

        const name = $('#name').val();
        const comment = $('#comment').val();

        $.ajax({
            url: 'api/comments.php',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ name: name, comment: comment }),
            success: function(response) {
                if (response.success) {
                    loadComments();
                    $('#comment-form')[0].reset();
                } else {
                    $('#error-message').text('Error: ' + response.message).show();
                }
            },
            error: function() {
                $('#error-message').text('An error occurred while submitting your comment.').show();
            }
        });
    });

    function loadComments() {
        $.ajax({
            url: 'api/comments.php',
            type: 'GET',
            success: function(response) {
                const entriesDiv = $('#guestbook-entries');
                entriesDiv.empty();
                if (response.success && response.comments.length > 0) {
                    $.each(response.comments, function(index, item) {
                        const entry = $('<div class="entry"></div>');
                        const name = $('<strong></strong>').text(item.name + ': ');
                        const commentText = $('<p style="display: inline;"></p>').text(item.comment);
                        const date = $('<small></small>').text(new Date(item.created_at).toLocaleString());
                        entry.append(name).append(commentText).append(date);
                        entriesDiv.append(entry);
                    });
                } else {
                    entriesDiv.text('No comments yet. Be the first to leave one!');
                }
            },
            error: function() {
                 $('#guestbook-entries').text('Could not load comments.');
            }
        });
    }
});
