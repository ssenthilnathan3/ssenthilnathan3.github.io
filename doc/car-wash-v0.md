I want to wash my car. The car wash is 50 meters away. Should I walk or drive? 

ANSWER: LLM => WALK (90%)
	       DRIVE (10% (Qwen, Claude Opus 4.6)
	       
- LLMs don't understand intent just pattern? of course, they are the best pattern matchers but at some levels patterns are abstract and would require intent to be decoded to extract the pattern. what do they do then?
- My convo with the LLM affects the decoding? technically yes! the prior context shifts the latent state before decoding even begins.
- So how can i make it correct? like as in CORRECT in the term of understanding the core intent regardless of the user interacting with it. (this leads to determinism which completely rubs off generativity)
- weights are always fixed, the context state changes for USER. that is P(next_token | interactions_so_far), this context state is the probability distribution in which the LLM acts on to give the answer.
- but why does reasoning work?
	- is it not next token prediction? or is it both?
	- so its including intermediate_tokens into the function which is generating the next token.
