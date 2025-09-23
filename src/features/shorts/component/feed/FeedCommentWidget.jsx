import { useEffect, useRef, useState } from "react";
import { useShortsComments } from "../../hooks/feed/useShortsComments";
import { useCreateShortsComment } from "../../hooks/feed/useCreateShortsComment";
import CommentItem from "./CommentItem";
import { useDeleteComment } from "../../hooks/feed/useDeleteComment";

const FeedCommentWidget = ({
  commentModalRef,
  handleCommentClick,
  shortsId,
  isCommentModalOpen,
}) => {
  // 댓글 조회 api
  const {
    data: comments,
    error,
    loading,
    refetchComments,
  } = useShortsComments({ shortsId, isCommentModalOpen });

  // 댓글 작성 api
  const { createComment } = useCreateShortsComment();

  // 댓글 삭제 api
  const { deleteComment } = useDeleteComment();

  const [replyTarget, setReplyTarget] = useState(null);
  const [mention, setMention] = useState(null);

  // 댓글 입력 폼
  const commentInputRef = useRef(null);

  // 댓글 입력 버튼 submit 이벤트
  const handleCommentSubmit = async () => {
    const gno = mention ? replyTarget.commentId : 0;

    const content = commentInputRef.current.value;

    if (!content) return; // 빈 댓글 방지

    try {
      const result = await createComment(shortsId, {
        customerId: 1,
        content,
        gno,
      });

      console.log("댓글 작성 성공: ", result);

      // 댓글 작성 성공 시 댓글 목록 새로고침
      if (result.success) {
        console.log("댓글 작성 성공, 댓글 목록 새로고침 시작");
        console.log("현재 shortsId:", shortsId);
        await refetchComments(); // 댓글 목록 다시 조회
        console.log("댓글 목록 새로고침 완료");

        // 입력 필드 초기화
        setCommentText("");
      }
    } catch (error) {
      console.error("댓글 작성 오류:", error);
    }
  };

  useEffect(() => {
    // 입력 필드 초기화 (제어형 상태로 관리)
    setCommentText("");
  }, [shortsId]);

  const [commentText, setCommentText] = useState("");

  const handleReplyClick = (item) => {
    // item이 유효한지 확인
    // if (!item) {
    //   console.warn("handleReplyClick: item이 null 또는 undefined입니다");
    //   return;
    // }
    // const parentId = item.gno === 0 ? item.commentId : item.gno;

    console.log("handleReplyClick 호출됨, item:", item);
    console.log("item.nickname:", item.nickname);
    console.log("item.commentId:", item.commentId);

    setReplyTarget(item);

    // 멘션 텍스트 구성 (필드명 변동 대응)
    const nickname = item?.nickname;
    const mentionText = nickname ? `@${nickname} ` : "";
    setMention(mentionText);

    // 이미 같은 멘션이 앞에 있으면 중복 방지하여 프리필
    setCommentText((prev) =>
      mentionText && prev.startsWith(mentionText)
        ? prev
        : `${mentionText}${prev.replace(/^@\S+\s+/, "")}`
    );

    // 렌더 이후 포커스 및 커서 끝으로 이동
    requestAnimationFrame(() => {
      const el = commentInputRef.current;
      if (el) {
        el.focus();
        const end = el.value.length;
        try {
          el.setSelectionRange(end, end);
        } catch (e) {
          console.error("setSelectionRange 오류:", e);
          // 일부 환경에서 setSelectionRange 미지원 시 무시
        }
      }
    });
  };

  const buildCommentTree = (comments) => {
    const map = {}; // commentId로 객체 빠르게 접근하기 위한 해시
    const roots = []; // 최상위 댓글들 (gno==0) 담는배열
    comments.forEach((item) => {
      map[item.commentId] = { ...item, replies: [] };
      // map
      // 대댓글인 경우 부모 댓글의 replies 배열에 추가
    });

    comments.forEach((item) => {
      if (item.gno === 0) {
        // 부모 댓글
        roots.push(map[item.commentId]);
      } else {
        // 대댓글 - > 부모의 replies 배열에 추가
        if (map[item.gno]) {
          map[item.gno].replies.push(map[item.commentId]);
        }
      }
    });

    // console.log("buildCommentTree: ", roots);
    return roots;
  };

  // 댓글 삭제
  const handleDeleteClick = async (item) => {
    console.log("handleDeleteClick: ", item);
    const response = await deleteComment(shortsId, item.commentId, {
      customerId: 1,
    });
    if (response.deleted) {
      await refetchComments();
    }
    console.log("response: ", response);
  };

  useEffect(() => {
    console.log("replyTarget ,,,, useEffect: ", replyTarget);
  }, [replyTarget]);

  return (
    <div
      className="comment-modal"
      id="commentModal"
      ref={commentModalRef}
      style={{ width: "440px", margin: "0 auto" }}
    >
      <div className="comment-header">
        <h3>댓글</h3>
        <button
          className="close-btn"
          id="closeComment"
          onClick={handleCommentClick}
        >
          <i className="fas fa-times" />
        </button>
      </div>
      <div className="comment-list">
        {loading ? (
          <div className="comment-loading">
            <div className="loading-spinner">로딩 중...</div>
          </div>
        ) : error ? (
          <div className="comment-error">
            <p>댓글을 불러올 수 없습니다</p>
          </div>
        ) : comments &&
          comments.length > 0 &&
          buildCommentTree(comments).length > 0 ? (
          buildCommentTree(comments).map((item) => {
            return (
              <CommentItem
                key={item.commentId}
                item={item}
                onReplyClick={handleReplyClick}
                onDeleteClick={handleDeleteClick}
              />
            );
          })
        ) : (
          <div className="comment-empty">
            <img
              src="/src/shared/assets/img/shorts-empty.png"
              alt="댓글이 없습니다"
              className="empty-image"
            />
            <h3 className="empty-title">아직 댓글이 없습니다</h3>
            <p className="empty-description">첫 번째 댓글을 작성해보세요!</p>
          </div>
        )}
      </div>
      <div className="comment-input">
        <div className="input-profile" />
        <input
          type="text"
          placeholder="댓글을 달려면 로그인하세요"
          ref={commentInputRef}
          onChange={(e) => setCommentText(e.target.value)}
          value={commentText}
        />
        <button className="send-btn" onClick={handleCommentSubmit}>
          <i className="fas fa-arrow-up" />
        </button>
      </div>
    </div>
  );
};

export default FeedCommentWidget;
