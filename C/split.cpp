#include <stdio.h>
#include <stdlib.h>

typedef int NodeType;

typedef struct _node
{
   NodeType data;
   struct _node *next;
} Linklist;

void display(Linklist *head)
{
   Linklist *p;
   for (p = head->next; p; p = p->next)
      printf("%d%c", p->data, (p->next ? ',' : '\n'));
}

void split(Linklist *a, Linklist *b, Linklist *c)
{
   Linklist *bp = b, *cp = c, *p;
   for (p = a->next; p; p = p->next)
   {
      if (p->data < 0)
      {
         bp->next = p;
         bp = p;
      }
      else if (p->data > 0)
      {
         cp->next = p;
         cp = p;
      }
   }
   bp->next = NULL;
   cp->next = NULL;
}

int main()
{
   Linklist *a = (Linklist *)malloc(sizeof(Linklist)),
            *b = (Linklist *)malloc(sizeof(Linklist)),
            *c = (Linklist *)malloc(sizeof(Linklist)),
            *ap = a;
   a->next = NULL;
   b->next = NULL;
   c->next = NULL;
   int i;
   for (i = 0; i < 10; i++)
   {
      int data = rand() % 100 - 50;
      Linklist *q = (Linklist *)malloc(sizeof(Linklist));
      q->data = data;
      q->next = NULL;
      ap->next = q;
      ap = q;
   }
   display(a);
   split(a, b, c);
   display(b);
   display(c);
   return 0;
}