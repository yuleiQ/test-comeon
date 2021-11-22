#include <stdio.h>
#include <stdlib.h>

typedef struct BitSortNode
{
   int data;                   //数据域
   struct BitSortNode *lchild; //左子树
   struct BitSortNode *rchild; //右子树
} BitSortNode, *BiSortTree;

//       20
//     /    \
//    10     30
//   /
//  5

//递归实现删除值为item的节点
int DeleteBiSortTree(BiSortTree &bst, int item)
{
   BiSortTree p;
   //树为空,未找到待删除元素,删除失败
   if (bst == NULL)
      return 0;
   //待删除元素小于树根结点值,继续在左子树中删除
   if (item < bst->data)
      return DeleteBiSortTree(bst->lchild, item);
   //待删除元素大于树根结点值,继续在右子树中删除
   if (item > bst->data)
      return DeleteBiSortTree(bst->rchild, item);

   //待删除元素等于树根结点值且左子树为空，将右子树作为整个树并返回真
   if (bst->lchild == NULL)
   {
      p = bst;
      bst = bst->rchild;
      free(p);
      return 1;
   }
   //待删除元素等于树根结点值且右子树为空，将左子树作为整个树并返回真
   else if (bst->rchild == NULL)
   {
      p = bst;
      bst = bst->lchild;
      free(p);
      return 1;
   }
   //待删除元素等于树根结点值且左、右子树均不为空时的处理情况
   else
   {
      //中序前驱结点就是左孩子结点时，把左孩子结点值赋给树根结点，
      //然后从左子树中删除根结点
      if (bst->lchild->rchild == NULL)
      {
         bst->data = bst->lchild->data;
         //转换成删除左孩子节点
         return DeleteBiSortTree(bst->lchild, bst->lchild->data);
      }
      //找出中序前驱结点，即左子树的右下角结点，把该结点值赋给树根结点，
      //然后从以中序前驱结点为根的树上删除根结点
      else
      {
         BiSortTree p1 = bst, p2 = bst->lchild;
         while (p2->rchild != NULL)
         {
            p1 = p2;
            p2 = p2->rchild;
         }
         bst->data = p2->data;
         //转换成删除最右节点
         return DeleteBiSortTree(p1->rchild, p2->data);
      }
   }
}
