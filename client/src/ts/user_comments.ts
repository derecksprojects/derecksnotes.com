import { getComments, sendComment, getUserInfo } from "./modules/request";

// comments section goes adjacent to article
// </article>
// <!-- comments section goes here -->

type AccountInfoRes = {
    // firstName: string;
    // lastName: string;
    username: string;
    email: string;
    profilePhoto: string;
    numberOfComments: number;
    // lastConnected: Date;
};

class CommentSectionHandler {
    page: string = window.location.pathname.split("/").pop(); // every article should have unique name

    private contentWrapper = document.querySelector(".content-wrapper") as HTMLDivElement;

    // user profile photo needs to be loaded
    private static readonly commentSection: string = `
    <div class="comment-section">
        <h2>Comments</h2>
        <div id="new-comment-form">
            <div class="comment-user-info">
                <span class="username">Login to comment!</span>
                <span class="datetime"></span>
                <button class="comment-action">Post</button>
            </div>
            <div class="new-comment-textarea">
                <img src="" class="comment-profile-photo">
                <textarea></textarea>
            </div>
        </div>
        <div class="comment-sort">
            <select>
                <option value="comment-sort-newest">Newest</option>
                <option value="comment-sort-oldest">Oldest</option>
                <option value="comment-sort-most-liked">Most Liked</option>
                <option value="comment-sort-most-disliked">Most Disliked</option>
            </select>
        </div>

        <div class="posted-comments"></div>
    </div>`;

    constructor() {
        // append the comment section to content-wrapper
        this.contentWrapper.insertAdjacentHTML("beforeend", CommentSectionHandler.commentSection);

        // get user info
        this.getUserInfo();
        this.addNewcommentListeners();

        this.getComments();
    }

    private async getComments() {
        let res: ServerRes = await getComments(10);
        if (!res.success) throw new Error(res.error);
        if (res.data.comments.length === 0) return console.log("No comments");

        // should get more comments if user clicks load more comments
        const commentsRes: CommentRes[] = res.data.comments;
        while (res.data.nextToken) {
            res = await getComments(10, res.data.nextToken);
            commentsRes.push(...res.data.comments);

            if (!res.success) throw new Error(res.error);
        }

        const postedCommentsDiv = document.querySelector(".comment-section .posted-comments") as HTMLDivElement;

        for (const comment of commentsRes) {
            let profilePhotoPath: string;
            if (comment.userInfo.profilePhoto) {
                profilePhotoPath = `/site-images/user-content/profile-photos/${comment.userInfo.profilePhoto}`;
            } else {
                profilePhotoPath = "/site-images/user-defaults/profile-photos/default-profile-photo-black.png";
            }

            const commentElement = `
            <div class="posted-comment">
                <div class="comment-user-info">
                    <span class="username">${comment.userInfo.username}</span>
                    <span class="datetime">${comment.commentInfo.datetime}</span>
                    <button class="comment-action comment-action-reply">Reply</button>
                    <button class="comment-action comment-action-report">Report</button>
                </div>
                <div class="posted-comment-holder">
                    <img src="${profilePhotoPath}" class="comment-profile-photo">
                    <div class="posted-comment-text">${comment.comment}</div>
                </div>
                <div class="posted-comment-actions">
                    <button class="like-button">Like</button>
                    <span class="like-count">${comment.commentInfo.likes}</span>
                    <button class="dislike-button">Dislike</button>
                    <span class="dislike-count">${comment.commentInfo.dislikes}</span>
                </div>
            </div>`;

            postedCommentsDiv.insertAdjacentHTML("beforeend", commentElement);
        }
    }
    
    private addNewcommentListeners() {
        // add event listener to the post button
        document.querySelector("#new-comment-form .comment-action").addEventListener("click", async () => {
            // get the value of the textarea
            const textarea: HTMLTextAreaElement = document.querySelector("#new-comment-form textarea");
            const comment: string = textarea.value.trim();

            // clear the textarea
            textarea.value = "";

            const datetime: string = new Date().toISOString();

            // send the comment to the server
            const res: ServerRes = await sendComment(comment, datetime);

            if (!res.success) throw new Error(res.error);
            window.location.reload();
        });
    }

    private async getUserInfo() {
        const profilePhoto: HTMLImageElement = document.querySelector("#new-comment-form .comment-profile-photo");

        const res: ServerRes = await getUserInfo();

        if (!res.success) {
            // a number between 1 and 4
            const photo_num: number = Math.floor(Math.random() * 4) + 1;

            // set the profile photo
            profilePhoto.src = `/site-images/user-defaults/profile-photos/default-profile-photo-${photo_num}-small.png`;
            return;
        }

        // from here only executes if user is logged in
        const userInfo: AccountInfoRes = res.data;

        // set the username
        // const username: HTMLSpanElement = document.createElement("span");
        const username: HTMLSpanElement = document.querySelector("#new-comment-form .username");
        username.textContent = userInfo.username;

        // set the profile photo
        profilePhoto.src = `/site-images/user-content/profile-photos/${userInfo.profilePhoto}`;
    }
}

new CommentSectionHandler();
